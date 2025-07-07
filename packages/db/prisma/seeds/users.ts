export const users = Array.from({ length: 200 }, (_, i) => ({
  email: `user${i + 1}@gmail.com`,
  name: `User ${i + 1}`,
}))
