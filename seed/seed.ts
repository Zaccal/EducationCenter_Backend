import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

const createUsers = async () => {
    const users: Prisma.UserCreateInput[] = [];

    for (let index = 1; index <= 8; index++) {
        const hashedPassword = await hash('12345678');

        users.push({
            avatar: faker.image.avatar(),
            email: faker.internet.email(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            password: hashedPassword,
        });
    }

    await prisma.user.createMany({
        data: users,
    });
};

const createLessons = async () => {
    const lessons: Prisma.LessonCreateInput[] = [];

    for (let index = 2; index <= 11; index++) {
        lessons.push({
            title: faker.lorem.sentence(14),
            url: 'https://www.youtube.com/embed/sUwD3GRPJos?si=U5mIJNTWsrijWb_W',
        });
    }

    await prisma.lesson.createMany({
        data: lessons,
    });
};

const createQuestion = async () => {
    for (let index = 1; index <= 10; index++) {
        const randomCount = faker.number.int({ min: 2, max: 11 });

        for (let indexFirst = 2; indexFirst <= randomCount; indexFirst++) {
            await prisma.question.create({
                data: {
                    comment: faker.lorem.lines({ min: 1, max: 3 }),
                    user: {
                        connect: {
                            id: indexFirst,
                        },
                    },
                    lesson: {
                        connect: {
                            id: index,
                        },
                    },
                },
            });
        }
    }
};

const createAnswers = async () => {
    for (let index = 1; index <= 40; index++) {
        await prisma.answer.create({
            data: {
                comment: faker.lorem.lines({ min: 2, max: 5 }),
                user: {
                    connect: {
                        id: 2,
                    },
                },
                question: {
                    connect: {
                        id: index,
                    },
                },
            },
        });
    }
};

const createHomeworks = async () => {
    for (let index = 1; index <= 10; index++) {
        const randomCount = faker.number.int({ min: 3, max: 11 });

        for (let indexFirst = 2; indexFirst <= randomCount; indexFirst++) {
            await prisma.homework.create({
                data: {
                    url: faker.internet.url(),
                    comment: faker.lorem.lines({ min: 1, max: 3 }),
                    user: {
                        connect: {
                            id: indexFirst,
                        },
                    },
                    lesson: {
                        connect: {
                            id: index,
                        },
                    },
                },
            });
        }
    }
};

async function main() {
    // await prisma.$executeRaw`TRUNCATE TABLE "Homework" RESTART IDENTITY CASCADE`;
    // createHomeworks();
}

main()
    .then(() => {
        // eslint-disable-next-line no-console
        console.log('Seeding was successfuly done!');
        prisma.$disconnect();
    })
    .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(`Error: ${error.message}`);
        prisma.$disconnect();
    })
    .finally(() => {
        prisma.$disconnect();
    });
