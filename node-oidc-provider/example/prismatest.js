import { PrismaClient } from '@prisma/client';

let prisma = new PrismaClient();
let user = await prisma.AspNetUsers.findUnique(
  {
    where: {
      UserName: 'a@b.com',
    },
    include: {
      AspNetUserClaims: true,
      AspNetUserRoles: {
        include: {
          AspNetRoles: true
        }
      },
    }
  },
);
console.log(user);
let claims = new Map(Map.groupBy(user.AspNetUserClaims, (obj) => obj.ClaimType).entries().map(([k, v]) => [k, v.length === 1 ? v[0].ClaimValue : v.map((obj) => obj.ClaimValue)]));
// console.log(claims);
claims.set("sub", "abcdefg");
let roles = user.AspNetUserRoles.map(r => r.AspNetRoles.Name);
claims.set("Roles", roles);
console.log(roles);
console.log(Object.fromEntries(claims.entries()));

// const bar = user.AspNetUserClaims.reduce<Record<string, string[]>>(
//   (prev, curr) => ({
//     ...prev,
//     [curr.ClaimType]: [
//       ...(prev[curr.ClaimType] ?? []),
//       curr.ClaimValue,
//     ],
//   }),
//     {}
// )
