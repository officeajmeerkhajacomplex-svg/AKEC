import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getProfileByPhone = query({
  args: { phone_number: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_phone", (q) => q.eq("phone_number", args.phone_number))
      .first();
  },
});

export const upsertProfile = mutation({
  args: {
    ustad_name: v.string(),
    department: v.string(),
    phone_number: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_phone", (q) => q.eq("phone_number", args.phone_number))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ustad_name: args.ustad_name,
        department: args.department,
      });
      return { ...existing, ustad_name: args.ustad_name, department: args.department };
    }

    const newId = await ctx.db.insert("profiles", {
      ustad_name: args.ustad_name,
      department: args.department,
      phone_number: args.phone_number,
    });
    
    return await ctx.db.get(newId);
  },
});
