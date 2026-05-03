import { db } from "./server/db";
import { debts } from "./shared/schema";
import { desc } from "drizzle-orm";

async function checkDebts() {
    try {
        const latest = await db.select().from(debts).orderBy(desc(debts.id)).limit(10);
        console.log("Latest 10 debts:");
        latest.forEach(d => {
            console.log(`ID: ${d.id}, Amount: ${d.amount}, CreatedAt: ${d.createdAt}, Status: ${d.status}`);
        });
    } catch (error) {
        console.error("Error checking debts:", error);
    } finally {
        process.exit();
    }
}

checkDebts();
