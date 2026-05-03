import { db } from "./server/db";
import { invoices } from "./shared/schema";
import { count } from "drizzle-orm";

async function checkInvoices() {
  try {
    const result = await db.select({ value: count() }).from(invoices);
    console.log(`Total invoices in database: ${result[0].value}`);
    
    if (result[0].value > 0) {
      const latest = await db.select().from(invoices).orderBy(invoices.createdAt).limit(5);
      console.log("Latest 5 invoices:");
      latest.forEach(inv => {
        console.log(`ID: ${inv.id}, Total: ${inv.totalAmount}, CreatedAt: ${inv.createdAt}`);
      });
    }
  } catch (error) {
    console.error("Error checking invoices:", error);
  } finally {
    process.exit();
  }
}

checkInvoices();
