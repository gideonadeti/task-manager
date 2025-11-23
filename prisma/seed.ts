import { PrismaClient, Priority } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { startOfDay, setHours, setMinutes, subDays, addDays } from "date-fns";

const prisma = new PrismaClient();

// Configuration constants
const CONFIG = {
  NO_DUE_DATE_PROBABILITY: 0.3,
  COMPLETED_TASK_PROBABILITY: 0.3,
  NO_DESCRIPTION_PROBABILITY: 0.4,
  OVERDUE_PROBABILITY: 0.25,
  TODAY_PROBABILITY: 0.1,
  URGENT_FUTURE_PROBABILITY: 0.3,
  PRIORITY_HIGH_PROBABILITY: 0.2,
  PRIORITY_MEDIUM_PROBABILITY: 0.5,
} as const;

// Realistic group names
const groupNames = [
  "Work Projects",
  "Personal Development",
  "Home & Family",
  "Health & Fitness",
  "Finance & Budget",
  "Learning & Education",
  "Travel Planning",
  "Shopping List",
  "Home Maintenance",
  "Social & Events",
  "Career Goals",
  "Hobbies & Interests",
  "Tech Projects",
  "Reading List",
  "Content Creation",
  "Networking",
  "Side Business",
  "Volunteer Work",
  "Backlog",
  "Urgent",
];

// Generate realistic due date with some overdue tasks
function getRandomDueDate(completed: boolean, referenceDate: Date): Date | null {
  // 30% chance of no due date
  if (Math.random() < CONFIG.NO_DUE_DATE_PROBABILITY) {
    return null;
  }

  // If completed, due date should be in the past (when it was completed)
  if (completed) {
    // Completed tasks: due date 0-30 days ago
    const daysAgo = faker.number.int({ min: 0, max: 30 });
    return subDays(referenceDate, daysAgo);
  }

  // Active tasks: mix of overdue, today, near future, and future
  const rand = Math.random();

  if (rand < CONFIG.OVERDUE_PROBABILITY) {
    // 25% overdue (1-30 days ago) - these are NOT completed, that's the point!
    const daysAgo = faker.number.int({ min: 1, max: 30 });
    return subDays(referenceDate, daysAgo);
  } else if (rand < CONFIG.OVERDUE_PROBABILITY + CONFIG.TODAY_PROBABILITY) {
    // 10% today
    const today = startOfDay(referenceDate);
    const hours = faker.number.int({ min: 0, max: 23 });
    const minutes = faker.number.int({ min: 0, max: 59 });
    return setMinutes(setHours(today, hours), minutes);
  } else if (rand < CONFIG.OVERDUE_PROBABILITY + CONFIG.TODAY_PROBABILITY + CONFIG.URGENT_FUTURE_PROBABILITY) {
    // 30% next 7 days (urgent)
    const daysFromNow = faker.number.int({ min: 1, max: 7 });
    return addDays(referenceDate, daysFromNow);
  } else {
    // 35% next 60 days
    const daysFromNow = faker.number.int({ min: 8, max: 60 });
    return addDays(referenceDate, daysFromNow);
  }
}

// Get random completion status (30% completed)
function getRandomCompleted(): boolean {
  return Math.random() < CONFIG.COMPLETED_TASK_PROBABILITY;
}

// Generate description with weighted distribution:
// 40% no description, 60% has description (1-8 paragraphs, higher counts are rare)
function generateDescription(): string | null {
  // 40% chance of no description
  if (Math.random() < CONFIG.NO_DESCRIPTION_PROBABILITY) {
    return null;
  }

  // Weighted distribution for paragraph count (1-8)
  // Higher numbers are exponentially rarer
  const rand = Math.random();
  let paragraphCount: number;

  if (rand < 0.5) {
    // 50% of descriptions: 1 paragraph
    paragraphCount = 1;
  } else if (rand < 0.75) {
    // 25% of descriptions: 2 paragraphs
    paragraphCount = 2;
  } else if (rand < 0.88) {
    // 13% of descriptions: 3 paragraphs
    paragraphCount = 3;
  } else if (rand < 0.94) {
    // 6% of descriptions: 4 paragraphs
    paragraphCount = 4;
  } else if (rand < 0.97) {
    // 3% of descriptions: 5 paragraphs
    paragraphCount = 5;
  } else if (rand < 0.99) {
    // 2% of descriptions: 6 paragraphs
    paragraphCount = 6;
  } else if (rand < 0.995) {
    // 0.5% of descriptions: 7 paragraphs
    paragraphCount = 7;
  } else {
    // 0.5% of descriptions: 8 paragraphs (very rare)
    paragraphCount = 8;
  }

  // Generate paragraphs (each paragraph is 2-4 sentences)
  const paragraphs: string[] = [];
  for (let i = 0; i < paragraphCount; i++) {
    const sentences = faker.number.int({ min: 2, max: 4 });
    const paragraph = faker.lorem.paragraph(sentences);
    paragraphs.push(paragraph);
  }

  return paragraphs.join("\n\n");
}

// Generate realistic task using faker
function generateTask(groupName: string): {
  title: string;
  description: string | null;
  priority: Priority;
} {
  // More realistic task titles based on group context
  let title: string;
  let description: string | null;

  if (groupName.includes("Work") || groupName.includes("Career")) {
    title = faker.helpers.arrayElement([
      `Review ${faker.company.buzzNoun()} proposal`,
      `Schedule ${faker.helpers.arrayElement([
        "team",
        "client",
        "stakeholder",
      ])} meeting`,
      `Update ${faker.helpers.arrayElement([
        "project",
        "API",
        "technical",
      ])} documentation`,
      `Prepare ${faker.helpers.arrayElement([
        "presentation",
        "report",
        "demo",
      ])} for ${faker.company.name()}`,
      `Code review for PR #${faker.number.int({ min: 100, max: 999 })}`,
      `Fix bug in ${faker.helpers.arrayElement([
        "authentication",
        "payment",
        "dashboard",
      ])} flow`,
      `Write tests for ${faker.helpers.arrayElement([
        "new feature",
        "payment module",
        "API endpoint",
      ])}`,
      `Deploy ${faker.helpers.arrayElement([
        "staging",
        "production",
      ])} environment`,
      `Update ${faker.helpers.arrayElement([
        "dependencies",
        "packages",
        "libraries",
      ])}`,
    ]);
    description = generateDescription();
  } else if (groupName.includes("Personal") || groupName.includes("Learning")) {
    title = faker.helpers.arrayElement([
      `Complete ${faker.helpers.arrayElement([
        "online course",
        "tutorial",
        "workshop",
      ])} module ${faker.number.int({ min: 1, max: 10 })}`,
      `Practice ${faker.helpers.arrayElement([
        "coding challenge",
        "algorithm",
        "design pattern",
      ])}`,
      `Read ${faker.helpers.arrayElement([
        "technical blog post",
        "book chapter",
        "article",
      ])} about ${faker.hacker.noun()}`,
      `Learn ${faker.helpers.arrayElement([
        "TypeScript",
        "React",
        "Node.js",
        "Docker",
      ])} ${faker.helpers.arrayElement([
        "generics",
        "hooks",
        "async patterns",
        "containers",
      ])}`,
      `Build ${faker.helpers.arrayElement([
        "portfolio project",
        "side project",
        "personal website",
      ])}`,
    ]);
    description = generateDescription();
  } else if (groupName.includes("Home") || groupName.includes("Family")) {
    title = faker.helpers.arrayElement([
      `${faker.helpers.arrayElement(["Grocery", "Weekly"])} shopping`,
      `Call ${faker.helpers.arrayElement(["parents", "family", "relatives"])}`,
      `Plan ${faker.helpers.arrayElement([
        "birthday party",
        "dinner party",
        "family gathering",
      ])}`,
      `Organize ${faker.helpers.arrayElement(["garage", "closet", "office"])}`,
      `Fix ${faker.helpers.arrayElement([
        "leaky faucet",
        "broken door",
        "squeaky hinge",
      ])}`,
      `Schedule ${faker.helpers.arrayElement([
        "dentist",
        "doctor",
        "vet",
      ])} appointment`,
    ]);
    description = generateDescription();
  } else if (groupName.includes("Health") || groupName.includes("Fitness")) {
    title = faker.helpers.arrayElement([
      `${faker.helpers.arrayElement(["Morning", "Evening", "5K"])} run`,
      `${faker.helpers.arrayElement([
        "Gym",
        "Upper body",
        "Lower body",
        "Full body",
      ])} workout`,
      `Meal prep for ${faker.helpers.arrayElement(["week", "next week"])}`,
      `Schedule annual ${faker.helpers.arrayElement([
        "physical",
        "checkup",
        "exam",
      ])}`,
      `${faker.helpers.arrayElement([
        "Yoga",
        "Meditation",
        "Stretching",
      ])} session`,
      `Track daily ${faker.helpers.arrayElement([
        "water intake",
        "calories",
        "steps",
      ])}`,
    ]);
    description = generateDescription();
  } else {
    // Generic tasks
    title = faker.helpers.arrayElement([
      faker.lorem.sentence({ min: 3, max: 6 }).replace(/\.$/, ""),
      `${faker.helpers.arrayElement([
        "Create",
        "Build",
        "Design",
        "Implement",
      ])} ${faker.hacker.noun()}`,
      `${faker.helpers.arrayElement([
        "Review",
        "Update",
        "Complete",
        "Plan",
      ])} ${faker.hacker.noun()}`,
    ]);
    description = generateDescription();
  }

  // Realistic priority distribution: 20% high, 50% medium, 30% low
  const priorityRand = Math.random();
  const priority: Priority =
    priorityRand < CONFIG.PRIORITY_HIGH_PROBABILITY
      ? "high"
      : priorityRand < CONFIG.PRIORITY_HIGH_PROBABILITY + CONFIG.PRIORITY_MEDIUM_PROBABILITY
      ? "medium"
      : "low";

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    description,
    priority,
  };
}

async function main() {
  const userId = process.env.SEED_USER_ID || "seed-user-123";

  console.log(`Seeding database with userId: ${userId}`);
  console.log("Creating groups...");

  // Create groups
  const groups = [];
  for (const name of groupNames) {
    const group = await prisma.group.create({
      data: {
        name,
        userId,
      },
    });
    groups.push(group);
    console.log(`Created group: ${name}`);
  }

  const totalTasks = 88;
  console.log(
    `\nCreating ${totalTasks} tasks across ${groups.length} groups...`
  );

  // Use a single reference date for consistency
  const referenceDate = new Date();

  // Create tasks spread across groups
  const tasksPerGroup = Math.floor(totalTasks / groups.length);
  const remainder = totalTasks % groups.length;

  // Prepare all tasks for batch creation
  const tasksToCreate: Array<{
    title: string;
    description: string | null;
    priority: Priority;
    dueDate: Date | null;
    completed: boolean;
    groupId: string;
    userId: string;
  }> = [];

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    // Distribute remainder tasks to first few groups
    const tasksForThisGroup = tasksPerGroup + (i < remainder ? 1 : 0);

    for (let j = 0; j < tasksForThisGroup; j++) {
      const completed = getRandomCompleted();
      const dueDate = getRandomDueDate(completed, referenceDate);
      const task = generateTask(group.name);

      tasksToCreate.push({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate,
        completed,
        groupId: group.id,
        userId,
      });
    }

    console.log(`Prepared ${tasksForThisGroup} tasks for group: ${group.name}`);
  }

  // Batch create all tasks
  console.log("\nCreating tasks in database...");
  await prisma.task.createMany({
    data: tasksToCreate,
  });

  const taskCount = tasksToCreate.length;

  console.log(`\n✅ Successfully seeded database!`);
  console.log(`   - ${groups.length} groups created`);
  console.log(`   - ${taskCount} tasks created`);
  console.log(
    `   - Includes overdue incomplete tasks, today, and future due dates`
  );
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
