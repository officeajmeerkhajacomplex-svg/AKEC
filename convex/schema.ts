import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    ustad_name: v.string(),
    department: v.string(),
    phone_number: v.string(),
  }).index("by_phone", ["phone_number"]),
  
  students: defineTable({
    name: v.string(),
    department: v.string(),
    guardian_phone: v.string(),
    ustad_id: v.id("profiles"),
  }).index("by_ustad", ["ustad_id"]),

  transactions: defineTable({
    student_id: v.id("students"),
    ustad_id: v.id("profiles"),
    amount: v.number(),
    type: v.union(v.literal("given"), v.literal("received")),
    note: v.string(),
    date: v.string(),
  }).index("by_student", ["student_id"]).index("by_ustad", ["ustad_id"]),
});
