# 03_Code_Patterns/06_db_query_logic.md

**[SYSTEM DIRECTIVE - DB QUERY FRAGMENTATION]**
**ROLE:** YOU ARE THE IMPLEMENTATION AGENT FOR FEATURE-GATED DATABASE ACCESS.
**PRIME CONSTRAINT:** A disabled feature must create zero DB load. Gate in the query construction and repository layer, never in view rendering.

---

## PHASE 1: QUERY GATING PATTERNS

### Pattern 1: Build-Time Query Fragmentation

```python
def get_users():
    cols = ["u.id", "u.name", "u.email"]
    joins = []

    if Flipper.is_active("ID_AVATARS"):
        cols.append("p.url AS avatar_url")
        joins.append("LEFT JOIN profile_pictures p ON p.user_id = u.id")

    return db.execute(f"SELECT {', '.join(cols)} FROM users u {' '.join(joins)}")
```

### Pattern 2: Conditional Wide-Column Selection

```python
def get_events(limit=100):
    cols = ["id", "event_type", "user_id", "created_at"]
    if Flipper.is_active("ID_RAW_EXPORT"):
        cols.append("payload")
    return db.execute(
        f"SELECT {', '.join(cols)} FROM events ORDER BY created_at DESC LIMIT :n",
        {"n": limit}
    )
```

### Pattern 3: Write Gating

```python
def record_geo_event(user_id, lat, lon, country):
    if not Flipper.is_active("ID_GEO_HEATMAP"):
        return
    db.execute(
        "INSERT INTO geo_events (user_id, latitude, longitude, country_code) VALUES (:uid, :lat, :lon, :cc)",
        {"uid": user_id, "lat": lat, "lon": lon, "cc": country}
    )
```

### Pattern 4: Cache Read/Write Symmetry

```js
async function cacheUserAvatar(userId, avatarUrl) {
  if (!Flipper.isActive("ID_AVATARS")) return;
  await redis.set(`avatar:${userId}`, avatarUrl, "EX", 3600);
}

async function getUserAvatar(userId) {
  if (!Flipper.isActive("ID_AVATARS")) return null;
  return await redis.get(`avatar:${userId}`);
}
```

### Pattern 5: Repository Guard Decorators

```python
def requires_feature(feature_id):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            if not Flipper.is_active(feature_id):
                return None
            return fn(*args, **kwargs)
        return wrapper
    return decorator
```

---

## PHASE 2: STRICT ANTI-PATTERNS

- Gating only in templates or serializers.
- Querying all joins then filtering unused data afterward.
- Writing feature-owned records while feature is disabled.
- Reading feature cache keys when writes are disabled.
- Unguarded optional repository functions.

---

## PHASE 3: AGENT OUTPUT REQUIREMENTS

When implementing DB adaptation, output MUST include:
1. Query fragmentation strategy (SQL/ORM/NoSQL).
2. Conditional joins/projections for disabled paths.
3. Gated writes and cache symmetry.
4. Optional decorator/wrapper approach for entire repository methods.
5. Verification checklist proving zero unnecessary DB work.

---

## PHASE 4: EXECUTION

1. Identify feature-owned query segments.
2. Move gating to repository/query builder layer.
3. Add conditional joins/projections/writes.
4. Gate associated cache operations.
5. Validate anti-pattern elimination.