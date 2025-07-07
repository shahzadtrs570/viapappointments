Field-level encryption for database fields that integrates seamlessly with Prisma.

## Features

- Strong AES-256-GCM encryption for secure field storage.
- Automatic encryption/decryption via Prisma middleware for various data types (strings, numbers, booleans, plain objects, arrays).
- Support for selective field encryption through environment configuration.
- Type-safe `encrypt` and `decrypt` functions for manual usage if needed.
- Configurable via environment variables.



## Configuration

### Environment Variables

Add these environment variables to your project's `.env` file:

```env
# Enable or disable encryption. Set to "true" to enable.
# Defaults to false if not set or not "true".
ENCRYPTION_ENABLED=true

# A 64-character hexadecimal encryption key. This is REQUIRED if ENCRYPTION_ENABLED is "true".
# Generate this key using the method described below.
ENCRYPTION_KEY=your_64_character_hex_key_here

# JSON configuration defining which model fields should be encrypted.
# Example: Encrypt 'email' and 'name' fields for the 'User' model,
# and 'cardNumber' for the 'Payment' model.
ENCRYPTED_FIELDS={"User":["email","name","encryptedTestData"],"Payment":["cardNumber"]}
```

### Generating a Secure Encryption Key

A secure 64-character hexadecimal key is required. You can generate one using Node.js:

1.  Open your terminal.
2.  Run the following Node.js command:
    ```bash
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    ```
3.  Copy the output (which will be a 64-character hex string) and use it as your `ENCRYPTION_KEY` in your `.env` file.

**Example Output:**
`13e08beca297e1d87c29e02ed04803316a5e9c0807454c74d12ac2ce0cbb5531`
**(Do NOT use this example key, generate your own unique key!)**



## How to Encrypt a New Field

To encrypt a new field in your database (e.g., `socialSecurityNumber` on a `Person` model):

1.  **Configure `ENCRYPTED_FIELDS`**: Update the `ENCRYPTED_FIELDS` variable in your `.env` file to include the new model and field.
    ```env
    # Example: Adding Person.socialSecurityNumber
    ENCRYPTED_FIELDS={"User":["email","name"],"Person":["socialSecurityNumber"]}
    ```
    If the model (`Person` in this case) already has other encrypted fields, simply add the new field to its array:
    ```env
    ENCRYPTED_FIELDS={"User":["email","name"],"Person":["existingField","socialSecurityNumber"]}
    ```
    Ensure the JSON structure is valid.

2.  **Use the Encrypted Prisma Client**: In your application code (typically in repository files), ensure that any database operations (create, update, find, etc.) that involve the new field (`socialSecurityNumber`) are performed using the Prisma client instance that has the encryption middleware applied (often named `db` or `encryptedDb`).
    ```typescript
    // Example in a repository
    // import { db } from '@path/to/your/encrypted-prisma-client';
    
    // This will automatically encrypt socialSecurityNumber before saving
    // and decrypt it when reading, if 'Person.socialSecurityNumber' is in ENCRYPTED_FIELDS.
    // const newPerson = await db.person.create({ data: { socialSecurityNumber: '...' } });
    // const person = await db.person.findUnique({ where: { id: '...' } });
    ```

3.  **Restart Your Application**: After modifying your `.env` file, restart your application server for the changes to `ENCRYPTED_FIELDS` to take effect.

That's it! The middleware handles the rest.

## Data Type Handling

This encryption package supports the following JavaScript data types for fields configured for encryption:

-   **Strings**: Encrypted and decrypted as strings.
-   **Numbers**: Converted to JSON strings (e.g., `30` becomes `"30"`) before encryption. Decrypted and parsed back to numbers by the Prisma middleware.
-   **Booleans**: Converted to JSON strings (e.g., `true` becomes `"true"`) before encryption. Decrypted and parsed back to booleans by the Prisma middleware.
-   **Objects (Plain)**: Must be JSON-serializable (no functions, Symbols, etc.). They are `JSON.stringify`'d before encryption. Decrypted and parsed back into objects by the Prisma middleware.
-   **Arrays**: Elements must be JSON-serializable. Arrays are `JSON.stringify`'d before encryption. Decrypted and parsed back into arrays by the Prisma middleware.
-   **`null` and `undefined`**: These values are skipped by the encryption process and stored as `null` or `undefined` directly in the database. They are not passed to the `encrypt` function.

## Usage

### Method 1: Prisma Middleware (Automatic Encryption/Decryption)

This is the recommended approach. It automatically handles encryption and decryption for configured fields across supported data types.

**1. Ensure your core encryption setup is available:**

The `@srenova/encryption` package provides `addEncryptionMiddleware` (used by `createEncryptedPrismaClient`) and `withEncryption`. The `withEncryption` function is a convenient wrapper around `addEncryptionMiddleware`.

```typescript
// From @srenova/encryption/src/encrypted-db.ts (conceptual)
// export function withEncryption<T>(dbClient: T): T {
//   return addEncryptionMiddleware(dbClient as any) as unknown as T;
// }
```

**2. Applying encryption in your repository (mirroring `user.repository.ts` pattern):**

In this pattern, your repository imports the base (unencrypted) Prisma client from your shared DB package and then applies the encryption wrapper locally.

```typescript
// Example: In a UserRepository (e.g., packages/api/src/routers/user/repository/user.repository.ts)
import { db as baseDb } from '@package/db'; // Assuming 'baseDb' is your original, UNENCRYPTED Prisma client instance
import { withEncryption } from '@srenova/encryption'; // Or the correct relative path to your encryption package
import type { User } from '@prisma/client'; // Assuming User type import for clarity

// Create an encrypted version of the Prisma client specifically for this repository
const encryptedDb = withEncryption(baseDb);

class UserRepository {
  async createUser(data: {
    email: string;
    name: string;
    age: number;
    isActive: boolean;
    profile: Record<string, any>;
    notes?: string | null;
    preferences?: any[];
    encryptedTestData?: string;
  }) {
    // Fields like 'name', 'age', 'encryptedTestData', etc., will be automatically encrypted by the middleware
    // within 'encryptedDb' if they are configured in ENCRYPTED_FIELDS for the User model.
    return encryptedDb.user.create({ data });
  }

  async findUserById(id: string): Promise<User | null> {
    // Encrypted fields will be automatically decrypted by 'encryptedDb' upon retrieval.
    const user = await encryptedDb.user.findUnique({ where: { id } });
    if (user) {
      console.log(user.name);      // Decrypted string
      console.log(user.age);       // Decrypted and parsed to number
      console.log(user.encryptedTestData); // Decrypted string (if it was encrypted)
    }
    return user;
  }

  async updateUserEncryptedTestData(userId: string, testData: string) {
    // 'encryptedTestData' will be automatically encrypted by 'encryptedDb' before the update.
    return encryptedDb.user.update({
      where: { id: userId },
      data: { encryptedTestData: testData },
    });
  }
  // ... other repository methods using encryptedDb
}

// Example of instantiating and using the repository
// const userRepository = new UserRepository();
// const newUser = await userRepository.createUser({
//   email: 'test@example.com',
//   name: 'John Doe',
//   age: 30,
//   isActive: true,
//   profile: { city: 'New York', interests: ['coding', 'music'] },
//   encryptedTestData: 'sensitive test data'
// });
// const foundUser = await userRepository.findUserById(newUser.id);
```

**Alternative: Centralized Encrypted Client**

Alternatively, you can create and export an encrypted Prisma client from a central file (e.g., `packages/db/src/index.ts`), and then all repositories import that already-encrypted client. This avoids each repository calling `withEncryption`.

```typescript
// Example: packages/db/src/index.ts
// import { PrismaClient } from '@prisma/client';
// import { withEncryption } from '@srenova/encryption';
// const basePrisma = new PrismaClient();
// export const db = withEncryption(basePrisma); // Repositories would import this 'db'
```

### Method 2: Manual Encryption/Decryption (Advanced Use)

Allows direct use of `encrypt` and `decrypt` functions. `encrypt` stringifies non-string types.

```typescript
import { encrypt, decrypt } from '@srenova/encryption';

// String
const encryptedString = encrypt('hello world');
const decryptedString = decrypt(encryptedString); // 'hello world'

// Number
const encryptedNumber = encrypt(123.45);
const decryptedNumberStr = decrypt(encryptedNumber); // '123.45' (string)
const originalNumber = JSON.parse(decryptedNumberStr); // 123.45 (number)

// Boolean
const encryptedBoolean = encrypt(false);
const decryptedBooleanStr = decrypt(encryptedBoolean); // 'false' (string)
const originalBoolean = JSON.parse(decryptedBooleanStr); // false (boolean)

// Object
const myObject = { a: 1, b: ['x', 'y'] };
const encryptedObject = encrypt(myObject);
const decryptedObject = decrypt(encryptedObject, true); // { a: 1, b: ['x', 'y'] } (parsed object)

// Array
const myArray = [true, 5, 'test', { nested: true }];
const encryptedArray = encrypt(myArray);
const decryptedArray = decrypt(encryptedArray, true); // [true, 5, 'test', { nested: true }] (parsed array)
```

**Note on Decryption with Prisma Middleware:**
When using the Prisma middleware, the `decryptFields` function intelligently attempts to `JSON.parse` decrypted strings that appear to be JSON objects (`{...}`) or arrays (`[...]`). This automatically converts stringified numbers, booleans, objects, and arrays back to their original types. Simple strings that were not originally JSON remain strings.

## Security Considerations

- **Key Management**: Store your `ENCRYPTION_KEY` securely. **Never commit it to version control.** Use environment variables as shown, and consider a secrets manager (like HashiCorp Vault, AWS Secrets Manager, Google Cloud Secret Manager, etc.) in production environments.
- **Key Rotation**: Implement a strategy for rotating your encryption key periodically for enhanced security. This package does not handle key versioning or rotation itself.
- **Database Indexing/Searching**: Encrypted fields cannot be directly used in database `WHERE` clauses for filtering or searching. If you need to search by an encrypted field, consider storing a separate, non-sensitive hash (e.g., SHA-256) of the plaintext value and search by that hash. The package includes a `hash()` utility for this.
- **Backup and Recovery**: Ensure your database backup and recovery strategy accounts for encrypted data and the availability of the corresponding encryption keys. Losing the key means losing access to the encrypted data.

## Utility Functions

The package also exports a few utility functions:

- `hash(data: string): string`: Computes a SHA-256 hash of the input string.
- `createSignature(data: string): string`: Creates an HMAC-SHA256 signature using the `ENCRYPTION_KEY`.
- `verifySignature(data: string, signature: string): boolean`: Verifies an HMAC-SHA256 signature.
- `generateEncryptionKey(): string`: Generates a new secure 64-character hex encryption key (useful for initial setup or key rotation).

## Troubleshooting

- **`ERR_CRYPTO_INVALID_KEYLEN`**: This error means your `ENCRYPTION_KEY` is not a valid 64-character hexadecimal string. Regenerate it and ensure it's correctly set in your environment.
- **Data not encrypting/decrypting**:
    - Ensure `ENCRYPTION_ENABLED` is set to `"true"`.
    - Verify `ENCRYPTION_KEY` is correctly set and is a 64-character hex string.
    - Check that the fields you expect to be encrypted are correctly listed in the `ENCRYPTED_FIELDS` environment variable JSON.
    - Make sure you are using the Prisma client instance that has had `addEncryptionMiddleware()` applied to it.
    - Check server logs for any error messages from the encryption package.
- **"Invalid encrypted data format" during decryption**: This usually means the data being decrypted was either not encrypted by this package, was encrypted with a different key, or the stored string has been corrupted or is not in the expected `iv:authTag:encryptedData` format.

## License

MIT 