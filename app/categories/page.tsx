"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Check, X, AlertCircle } from "lucide-react";
import { ClientLayout } from "../components/ClientLayout";
import { AppIcon, CATEGORY_ICONS } from "../components/AppIcon";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { addCategory, updateCategory, deleteCategory, updateBudget } from "../store/financeSlice";
import { selectExpensesByCategory } from "../store/selectors";
import type { Category } from "../store/financeSlice";

function fmt(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

const PRESET_COLORS = [
  "#F97316", "#3B82F6", "#8B5CF6", "#EC4899", "#6B7280",
  "#10B981", "#F59E0B", "#EF4444", "#06B6D4", "#84CC16",
];

const PRESET_ICONS = CATEGORY_ICONS;

interface EditForm {
  name: string;
  color: string;
  icon: string;
}

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.finance.categories);
  const expensesByCategory = useAppSelector(selectExpensesByCategory);
  const budget = useAppSelector(state => state.finance.budget);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ name: "", color: "", icon: "" });

  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState<EditForm>({ name: "", color: "#10B981", icon: "Box" });

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, color: cat.color, icon: cat.icon });
  };

  const saveEdit = (id: string) => {
    if (!editForm.name.trim()) return;
    dispatch(updateCategory({ id, updates: editForm }));
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!addForm.name.trim()) return;
    dispatch(addCategory(addForm));
    setAddForm({ name: "", color: "#10B981", icon: "Box" });
    setAdding(false);
  };

  const confirmDelete = (id: string) => {
    dispatch(deleteCategory(id));
    const newLimits = { ...budget.categoryLimits };
    delete newLimits[id];
    dispatch(updateBudget({ categoryLimits: newLimits }));
    setDeleteConfirm(null);
  };

  const totalSpent = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);

  return (
    <ClientLayout>
      <div className="p-4 md:p-6 space-y-5 ">
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ color: "#0F172A" }}>Categories</h1>
            <p className="text-gray-500" style={{ fontSize: "1.15rem" }}>
              {categories.length} categories · Manage and customize
            </p>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4 py-2 transition-colors"
          >
            <Plus size={16} />
            <span style={{ fontWeight: 600, fontSize: "1.15rem" }}>New Category</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
            <p className="text-gray-500" style={{ fontSize: "1rem" }}>Total Categories</p>
            <p style={{ fontWeight: 700, color: "#0F172A", fontSize: "1.65rem" }}>{categories.length}</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
            <p className="text-gray-500" style={{ fontSize: "1rem" }}>Total Spent</p>
            <p style={{ fontWeight: 700, color: "#EF4444", fontSize: "1.4rem" }}>{fmt(totalSpent)}</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
            <p className="text-gray-500" style={{ fontSize: "1rem" }}>Budget Allocated</p>
            <p style={{ fontWeight: 700, color: "#0F172A", fontSize: "1.4rem" }}>
              {fmt(Object.values(budget.categoryLimits).reduce((a, b) => a + b, 0))}
            </p>
          </div>
        </div>

        {adding && (
          <div className="bg-white rounded-2xl border-2 border-emerald-300 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 style={{ color: "#0F172A" }}>New Category</h3>
              <button onClick={() => setAdding(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1.5" style={{ fontSize: "1.1rem", fontWeight: 500 }}>Category Name *</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="e.g. Healthcare"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1.5" style={{ fontSize: "1.1rem", fontWeight: 500 }}>Icon</label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setAddForm({ ...addForm, icon })}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        addForm.icon === icon ? "ring-2 ring-emerald-500 bg-emerald-50" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <AppIcon name={icon} size="lg" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 mb-1.5" style={{ fontSize: "1.1rem", fontWeight: 500 }}>Color</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setAddForm({ ...addForm, color })}
                    className={`w-7 h-7 rounded-full transition-transform ${addForm.color === color ? "scale-125 ring-2 ring-offset-1 ring-gray-400" : "hover:scale-110"}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setAdding(false)}
                className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ fontSize: "1.15rem" }}
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!addForm.name.trim()}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                style={{ fontSize: "1.15rem", fontWeight: 600 }}
              >
                Create Category
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
            <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#6B7280" }}>
              DEFAULT CATEGORIES
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {categories.map(cat => {
              const spent = expensesByCategory[cat.id] || 0;
              const limit = budget.categoryLimits[cat.id] || 0;
              const isEditing = editingId === cat.id;
              const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
              const barColor = pct >= 100 ? "#EF4444" : pct >= 75 ? "#F97316" : "#22C55E";

              return (
                <div key={cat.id} className={`px-5 py-4 transition-colors ${isEditing ? "bg-emerald-50/50" : "hover:bg-gray-50/50"}`}>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-500 mb-1" style={{ fontSize: "1rem", fontWeight: 500 }}>Name</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full border border-emerald-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                            style={{ fontSize: "1.15rem" }}
                            autoFocus
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1" style={{ fontSize: "1rem", fontWeight: 500 }}>Icon</label>
                          <div className="flex flex-wrap gap-1">
                            {PRESET_ICONS.map(icon => (
                              <button
                                key={icon}
                                type="button"
                                onClick={() => setEditForm({ ...editForm, icon })}
                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                  editForm.icon === icon ? "ring-2 ring-emerald-500 bg-emerald-50" : "bg-gray-100 hover:bg-gray-200"
                                }`}
                              >
                                <AppIcon name={icon} size="lg" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1.5" style={{ fontSize: "1rem", fontWeight: 500 }}>Color</label>
                        <div className="flex flex-wrap gap-2">
                          {PRESET_COLORS.map(color => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setEditForm({ ...editForm, color })}
                              className={`w-6 h-6 rounded-full transition-transform ${editForm.color === color ? "scale-125 ring-2 ring-offset-1 ring-gray-400" : "hover:scale-110"}`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1" style={{ fontSize: "1.1rem" }}>
                          <X size={13} /> Cancel
                        </button>
                        <button onClick={() => saveEdit(cat.id)} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-1" style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                          <Check size={13} /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: cat.color + "18" }}
                      >
                        <AppIcon name={cat.icon} size="xl" style={{ color: cat.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span style={{ fontWeight: 600, color: "#0F172A" }}>{cat.name}</span>
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                          </div>
                          <div className="flex items-center gap-1 text-gray-400">
                            <span style={{ fontSize: "1.15rem", fontWeight: 600, color: "#0F172A" }}>{fmt(spent)}</span>
                            {limit > 0 && <span style={{ fontSize: "1rem", color: "#9CA3AF" }}>/ {fmt(limit)}</span>}
                          </div>
                        </div>
                        {limit > 0 ? (
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, backgroundColor: barColor }}
                            />
                          </div>
                        ) : (
                          <div className="h-1.5 bg-gray-100 rounded-full" />
                        )}
                        <p className="text-gray-400 mt-0.5" style={{ fontSize: "1rem" }}>
                          {limit > 0
                            ? pct >= 100
                              ? `Over budget by ${fmt(spent - limit)}`
                              : `${fmt(limit - spent)} remaining`
                            : "No budget set"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => startEdit(cat)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        {deleteConfirm === cat.id ? (
                          <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
                            <span style={{ fontSize: "1rem", color: "#DC2626" }}>Delete?</span>
                            <button onClick={() => confirmDelete(cat.id)} className="text-red-500 hover:text-red-600">
                              <Check size={13} />
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="text-gray-400 hover:text-gray-600">
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(cat.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <AlertCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p style={{ fontSize: "1.1rem", color: "#1E40AF", lineHeight: 1.6 }}>
            <strong>Tip:</strong> You can customize category names, icons, and colors to match your personal spending style. 
            Delete a category to remove it from expense tracking — existing transactions won't be affected.
          </p>
        </div>
      </div>
    </ClientLayout>
  );
}
