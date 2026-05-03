import { db } from "./server/db";
import { invoices } from "./shared/schema";
import { desc } from "drizzle-orm";

async function checkInvoices() {
    try {
        const latest = await db.select().from(invoices).orderBy(desc(invoices.id)).limit(10);
        console.log("Latest 10 invoices (descending ID):");
        latest.forEach(inv => {
            console.log(`ID: ${inv.id}, Total: ${inv.totalAmount}, CreatedAt: ${inv.createdAt}`);
        });
    } catch (error) {
        console.error("Error checking invoices:", error);
    } finally {
        process.exit();
    }
}

checkInvoices();
