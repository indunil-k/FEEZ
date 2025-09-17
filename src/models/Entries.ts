import mongoose, { Document, Model, Schema } from 'mongoose';

// Monthly payment status interface
export interface IMonthlyPaymentStatus {
  1: boolean;
  2: boolean;
  3: boolean;
  4: boolean;
  5: boolean;
  6: boolean;
  7: boolean;
  8: boolean;
  9: boolean;
  10: boolean;
  11: boolean;
  12: boolean;
}

// Entry interface
export interface IEntry {
  name: string;
  monthlyPaymentStatus: IMonthlyPaymentStatus;
}

// Group interface
export interface IGroup {
  name: string;
  entries: IEntry[];
}

// Main Entries document interface
export interface IEntries extends Document {
  userID: mongoose.Types.ObjectId;
  groups: IGroup[];
  getGroups(): string[];
  addGroup(groupName: string): Promise<IEntries>;
  addEntry(groupName: string, entryName: string): Promise<IEntries>;
  updatePaymentStatus(groupName: string, entryName: string, month: number, status: boolean): Promise<IEntries>;
  removeEntry(groupName: string, entryName: string): Promise<IEntries>;
  getEntryNames(groupName: string): string[];
}

// Monthly payment status schema
const MonthlyPaymentStatusSchema = new mongoose.Schema({
  1: { type: Boolean, default: false },
  2: { type: Boolean, default: false },
  3: { type: Boolean, default: false },
  4: { type: Boolean, default: false },
  5: { type: Boolean, default: false },
  6: { type: Boolean, default: false },
  7: { type: Boolean, default: false },
  8: { type: Boolean, default: false },
  9: { type: Boolean, default: false },
  10: { type: Boolean, default: false },
  11: { type: Boolean, default: false },
  12: { type: Boolean, default: false },
}, { _id: false });

// Entry schema
const EntrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  monthlyPaymentStatus: {
    type: MonthlyPaymentStatusSchema,
    required: true,
    default: () => ({
      1: false, 2: false, 3: false, 4: false, 5: false, 6: false,
      7: false, 8: false, 9: false, 10: false, 11: false, 12: false
    })
  }
}, { _id: false });

// Group schema
const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  entries: { type: [EntrySchema], default: [] }
}, { _id: false });

// Main Entries schema
const EntriesSchema: Schema<IEntries> = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User'
    },
    groups: { type: [GroupSchema], default: [] }
  },
  {
    timestamps: true
  }
);

EntriesSchema.index({ userID: 1 });

// Helper methods
EntriesSchema.methods.getGroups = function(): string[] {
  return this.groups.map((g: IGroup) => g.name);
};

EntriesSchema.methods.addGroup = async function(groupName: string) {
  if (this.groups.find((g: IGroup) => g.name === groupName)) {
    throw new Error(`Group '${groupName}' already exists`);
  }
  this.groups.push({ name: groupName, entries: [] });
  return this.save();
};

EntriesSchema.methods.addEntry = async function(groupName: string, entryName: string) {
  const group = this.groups.find((g: IGroup) => g.name === groupName);
  if (!group) throw new Error(`Group '${groupName}' not found`);
  if (group.entries.find((e: IEntry) => e.name === entryName)) {
    throw new Error(`Entry '${entryName}' already exists in group '${groupName}'`);
  }
  group.entries.push({ name: entryName, monthlyPaymentStatus: {
    1: false, 2: false, 3: false, 4: false, 5: false, 6: false,
    7: false, 8: false, 9: false, 10: false, 11: false, 12: false
  }});
  return this.save();
};

EntriesSchema.methods.updatePaymentStatus = async function(groupName: string, entryName: string, month: number, status: boolean) {
  const group = this.groups.find((g: IGroup) => g.name === groupName);
  if (!group) throw new Error(`Group '${groupName}' not found`);
  const entry = group.entries.find((e: IEntry) => e.name === entryName);
  if (!entry) throw new Error(`Entry '${entryName}' not found in group '${groupName}'`);
  if (month < 1 || month > 12) throw new Error('Month must be between 1 and 12');
  entry.monthlyPaymentStatus[month] = status;
  return this.save();
};

EntriesSchema.methods.removeEntry = async function(groupName: string, entryName: string) {
  const group = this.groups.find((g: IGroup) => g.name === groupName);
  if (!group) throw new Error(`Group '${groupName}' not found`);
  group.entries = group.entries.filter((e: IEntry) => e.name !== entryName);
  return this.save();
};

EntriesSchema.methods.getEntryNames = function(groupName: string): string[] {
  const group = this.groups.find((g: IGroup) => g.name === groupName);
  if (!group) return [];
  return group.entries.map((e: IEntry) => e.name);
};

// Prevent re-compilation during development
const Entries: Model<IEntries> = mongoose.models.Entries || mongoose.model<IEntries>('Entries', EntriesSchema);

export default Entries;
