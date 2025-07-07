# Prisma Field Encryption Setup

## Environment Variables Required

Add these to your `.env` file:

```bash
# Field Encryption Key - Generate using: npx cloak generate or visit https://cloak.47ng.com
PRISMA_FIELD_ENCRYPTION_KEY="k1.aesgcm256.YOUR_GENERATED_KEY_HERE"

# Optional: Global salt for hash fields (recommended for production)
PRISMA_FIELD_ENCRYPTION_HASH_SALT="your-random-salt-string-here"
```

## Sample Encryption Key

For development/testing (DO NOT USE IN PRODUCTION):
```bash
PRISMA_FIELD_ENCRYPTION_KEY="k1.aesgcm256.DbQoar8ZLuUsOHZNyrnjlskInHDYlzF3q6y1KGM7DUM="
```

## Key Generation

Generate a production key using one of these methods:

### Method 1: Web Interface
Visit: https://cloak.47ng.com

### Method 2: Command Line (after package installation)
```bash
npx cloak generate
```

### Method 3: Manual Generation
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# Then prefix with "k1.aesgcm256."
```

## Security Notes

1. **Never commit encryption keys to version control**
2. **Use different keys for different environments**
3. **Store production keys in secure key management systems**
4. **Rotate keys periodically using the migration features**
5. **Use hash fields for searchable encrypted data**

## Database Field Length Requirements

Encryption adds significant overhead. Update VARCHAR lengths:

- Short fields (names): VARCHAR(255) → VARCHAR(500)
- Medium fields (addresses): VARCHAR(500) → VARCHAR(1000)  
- Long fields (descriptions): TEXT fields are recommended

Use the ciphertext length calculator: https://cloak.47ng.com/ciphertext-length-calculator 