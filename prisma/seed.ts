import { PrismaClient, Priority } from "@prisma/client";

const prisma = new PrismaClient();

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

// Realistic task templates with variations
const taskTemplates = [
  // Work-related
  { title: "Review Q4 project proposal", description: "Go through the proposal and provide feedback", priority: "high" as Priority },
  { title: "Schedule team meeting", description: "Coordinate with team members for next sprint planning", priority: "medium" as Priority },
  { title: "Update project documentation", description: "Ensure all API docs are up to date", priority: "medium" as Priority },
  { title: "Prepare presentation slides", description: "Create slides for client presentation next week", priority: "high" as Priority },
  { title: "Code review for PR #234", description: "Review pull request and provide comments", priority: "medium" as Priority },
  { title: "Fix bug in authentication flow", description: "Users reporting login issues on mobile", priority: "high" as Priority },
  { title: "Write unit tests for new feature", description: "Add test coverage for payment module", priority: "medium" as Priority },
  { title: "Deploy staging environment", description: "Push latest changes to staging for QA", priority: "low" as Priority },
  { title: "Update dependencies", description: "Check for security updates in npm packages", priority: "low" as Priority },
  { title: "Plan architecture for new microservice", description: "Design system architecture document", priority: "medium" as Priority },
  
  // Personal Development
  { title: "Complete online course module 3", description: "Finish React advanced patterns course", priority: "medium" as Priority },
  { title: "Practice coding challenge", description: "Solve 2 LeetCode problems", priority: "low" as Priority },
  { title: "Read technical blog post", description: "Catch up on latest web development trends", priority: "low" as Priority },
  { title: "Set up development environment", description: "Configure new laptop for work", priority: "medium" as Priority },
  { title: "Learn TypeScript generics", description: "Study advanced TypeScript concepts", priority: "low" as Priority },
  { title: "Build portfolio project", description: "Start working on personal website redesign", priority: "medium" as Priority },
  { title: "Attend tech meetup", description: "Network with other developers in the area", priority: "low" as Priority },
  { title: "Write blog post about recent project", description: "Document lessons learned from last project", priority: "low" as Priority },
  
  // Home & Family
  { title: "Grocery shopping", description: "Buy ingredients for weekend dinner party", priority: "high" as Priority },
  { title: "Call parents", description: "Check in with family this weekend", priority: "medium" as Priority },
  { title: "Plan birthday party", description: "Organize decorations and cake for kid's birthday", priority: "high" as Priority },
  { title: "Organize garage", description: "Sort through old items and donate unused things", priority: "low" as Priority },
  { title: "Fix leaky faucet", description: "Replace washer in kitchen sink", priority: "medium" as Priority },
  { title: "Schedule dentist appointment", description: "Book checkup for next month", priority: "medium" as Priority },
  { title: "Pack for weekend trip", description: "Prepare luggage for family vacation", priority: "high" as Priority },
  { title: "Update family calendar", description: "Sync all events and appointments", priority: "low" as Priority },
  
  // Health & Fitness
  { title: "Morning run", description: "5K run in the park", priority: "medium" as Priority },
  { title: "Gym workout", description: "Upper body strength training", priority: "medium" as Priority },
  { title: "Meal prep for week", description: "Prepare healthy lunches for work", priority: "high" as Priority },
  { title: "Schedule annual physical", description: "Book doctor's appointment", priority: "medium" as Priority },
  { title: "Yoga session", description: "30-minute evening yoga routine", priority: "low" as Priority },
  { title: "Track daily water intake", description: "Aim for 8 glasses today", priority: "low" as Priority },
  { title: "Research healthy recipes", description: "Find new meal ideas for next week", priority: "low" as Priority },
  { title: "Buy new running shoes", description: "Current pair is worn out", priority: "medium" as Priority },
  
  // Finance
  { title: "Review monthly budget", description: "Check spending vs. budget for this month", priority: "high" as Priority },
  { title: "Pay credit card bill", description: "Due date is approaching", priority: "high" as Priority },
  { title: "Set up automatic savings transfer", description: "Configure monthly transfer to savings account", priority: "medium" as Priority },
  { title: "Review investment portfolio", description: "Check performance and rebalance if needed", priority: "low" as Priority },
  { title: "File expense reports", description: "Submit receipts from business trip", priority: "medium" as Priority },
  { title: "Research retirement plan options", description: "Compare 401k contribution rates", priority: "low" as Priority },
  { title: "Cancel unused subscription", description: "Remove subscription for service no longer using", priority: "low" as Priority },
  
  // Learning & Education
  { title: "Study for certification exam", description: "Review materials for AWS certification", priority: "high" as Priority },
  { title: "Complete assignment", description: "Finish homework for online course", priority: "high" as Priority },
  { title: "Watch tutorial video", description: "Learn about Docker containerization", priority: "low" as Priority },
  { title: "Take practice quiz", description: "Test knowledge on database design", priority: "medium" as Priority },
  { title: "Join study group", description: "Attend weekly study session", priority: "medium" as Priority },
  { title: "Research graduate programs", description: "Look into master's degree options", priority: "low" as Priority },
  
  // Travel
  { title: "Book hotel for vacation", description: "Reserve room for summer trip", priority: "high" as Priority },
  { title: "Apply for travel visa", description: "Submit documents for international travel", priority: "high" as Priority },
  { title: "Create travel itinerary", description: "Plan daily activities for trip", priority: "medium" as Priority },
  { title: "Research local restaurants", description: "Find good places to eat at destination", priority: "low" as Priority },
  { title: "Pack travel essentials", description: "Prepare carry-on bag with necessities", priority: "medium" as Priority },
  { title: "Check travel insurance", description: "Verify coverage for upcoming trip", priority: "low" as Priority },
  
  // Shopping
  { title: "Buy birthday gift", description: "Find present for friend's birthday", priority: "high" as Priority },
  { title: "Order office supplies", description: "Restock printer paper and pens", priority: "low" as Priority },
  { title: "Purchase new headphones", description: "Current ones are broken", priority: "medium" as Priority },
  { title: "Buy groceries", description: "Weekly shopping trip", priority: "high" as Priority },
  { title: "Research laptop options", description: "Compare specs and prices for new laptop", priority: "low" as Priority },
  
  // Home Maintenance
  { title: "Change air filter", description: "Replace HVAC filter", priority: "medium" as Priority },
  { title: "Clean gutters", description: "Remove leaves and debris", priority: "low" as Priority },
  { title: "Paint bedroom wall", description: "Touch up paint in master bedroom", priority: "low" as Priority },
  { title: "Fix squeaky door", description: "Apply lubricant to door hinges", priority: "low" as Priority },
  { title: "Test smoke detectors", description: "Check all smoke alarms in house", priority: "medium" as Priority },
  { title: "Organize tool shed", description: "Sort and label all tools", priority: "low" as Priority },
  
  // Social & Events
  { title: "RSVP to wedding", description: "Confirm attendance for friend's wedding", priority: "high" as Priority },
  { title: "Plan dinner party", description: "Organize menu and guest list", priority: "medium" as Priority },
  { title: "Send thank you cards", description: "Write notes for recent gifts", priority: "medium" as Priority },
  { title: "Coordinate group outing", description: "Plan activity with friends", priority: "low" as Priority },
  
  // Career
  { title: "Update LinkedIn profile", description: "Add recent projects and skills", priority: "medium" as Priority },
  { title: "Prepare for job interview", description: "Research company and practice questions", priority: "high" as Priority },
  { title: "Network with industry professionals", description: "Reach out to contacts on LinkedIn", priority: "low" as Priority },
  { title: "Update resume", description: "Add latest work experience", priority: "medium" as Priority },
  
  // Content Creation
  { title: "Edit video for YouTube", description: "Finish editing tutorial video", priority: "medium" as Priority },
  { title: "Write newsletter", description: "Draft monthly newsletter for subscribers", priority: "medium" as Priority },
  { title: "Plan social media content", description: "Schedule posts for next week", priority: "low" as Priority },
  { title: "Record podcast episode", description: "Interview guest for next episode", priority: "high" as Priority },
  
  // Miscellaneous
  { title: "Backup important files", description: "Create backup of documents and photos", priority: "medium" as Priority },
  { title: "Organize email inbox", description: "Archive old emails and create folders", priority: "low" as Priority },
  { title: "Update passwords", description: "Change passwords for important accounts", priority: "medium" as Priority },
  { title: "Review and respond to messages", description: "Catch up on unread messages", priority: "low" as Priority },
];

// Generate random date within next 60 days
function getRandomDueDate(): Date | null {
  const daysFromNow = Math.floor(Math.random() * 60);
  const hoursFromNow = Math.floor(Math.random() * 24);
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hoursFromNow, 0, 0, 0);
  
  // 30% chance of no due date
  if (Math.random() < 0.3) {
    return null;
  }
  
  return date;
}

// Get random completion status (30% completed)
function getRandomCompleted(): boolean {
  return Math.random() < 0.3;
}

async function main() {
  const userId = process.env.SEED_USER_ID || "seed-user-123";
  
  console.log(`Seeding database with userId: ${userId}`);
  console.log("Creating 20 groups...");

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

  console.log(`\nCreating 88 tasks across ${groups.length} groups...`);

  // Create 88 tasks spread across groups
  const tasksPerGroup = Math.floor(88 / groups.length);
  const remainder = 88 % groups.length;
  
  let taskCount = 0;
  
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    // Distribute remainder tasks to first few groups
    const tasksForThisGroup = tasksPerGroup + (i < remainder ? 1 : 0);
    
    for (let j = 0; j < tasksForThisGroup; j++) {
      const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
      const completed = getRandomCompleted();
      const dueDate = completed ? null : getRandomDueDate(); // Completed tasks don't have due dates
      
      await prisma.task.create({
        data: {
          title: template.title,
          description: template.description,
          priority: template.priority,
          dueDate,
          completed,
          groupId: group.id,
          userId,
        },
      });
      
      taskCount++;
    }
    
    console.log(`Created ${tasksForThisGroup} tasks in group: ${group.name}`);
  }

  console.log(`\n✅ Successfully seeded database!`);
  console.log(`   - ${groups.length} groups created`);
  console.log(`   - ${taskCount} tasks created`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

