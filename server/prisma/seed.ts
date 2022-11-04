import { prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Jhon Doe',
      email: 'jd@gmail.com',
      avatarUrl: 'github.com/caramujox.png'
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Exemploo',
      code: 'bol123',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-02T12:00:30.764Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR'
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-03T12:00:30.764Z',
      firstTeamCountryCode: 'AR',
      secondTeamCountryCode: 'BR',
      guesses: {
        create: {
          firstTeamPoints: 0,
          secondTeamPoints: 2,
          participant: {
            connect: {
              userId_poolId: {
                poolId: pool.id,
                userId: user.id
              }
            }
          }
        }
      }
    }
  })
}

main()
