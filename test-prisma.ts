import { prisma } from './src/lib/prisma'

async function main() {
    console.log('Testing Prisma connection...')

    // Create test user
    const user = await prisma.user.create({
        data: {
            email: 'test@gmail.com',
            password: 'example',
            name: 'Jack Lamothe',
            team: 'JWU Wildcats',
            position: 'Right Wing'
        },
    })

    console.log('Created User: ', user)

    // Create test game
    const game = await prisma.game.create({
        data: {
            userId: user.id,
            date: new Date('2025-11-15'),
            opponent: 'Nichols College',
            homeAway: 'home',
            result: 'win',
            goals: 2,
            assists: 2,
            shots: 5,
            plusMinus: 2,
            iceTime: 18.30
        },
    })

    console.log('Created game: ', game)

    // Fetch user with their games
    const userWithGames = await prisma.user.findUnique({
        where: { id: user.id},
        include: { games: true },
    })

    console.log('User with games: ', userWithGames)

    // Clean up test data

    await prisma.game.delete({ where: { id: game.id } })
    await prisma.user.delete({ where: { id: user.id } })
    
    console.log('Test complete! Everything works.')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })