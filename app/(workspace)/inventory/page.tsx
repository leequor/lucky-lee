import Link from "next/link";

import { addPartAction, adjustStockAction } from "@/app/actions/repair";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { SelectField } from "@/components/workspace/form-controls";
import {
  DataBar,
  Feedback,
  PageHeader,
  Panel,
  PrimaryLink,
} from "@/components/workspace/ui";
import { formatMoney } from "@/lib/repair/format";
import { getInventory } from "@/lib/repair/queries";

export const dynamic = "force-dynamic";

const CATEGORIES = ["screen", "battery", "charging", "camera", "keyboard", "storage", "cooling", "supplies", "general"];

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; notice?: string; error?: string; new?: string }>;
}) {
  const params = await searchParams;
  const parts = await getInventory(params.q);
  const lowStock = parts.filter((part) => part.stock <= part.reorder_level);
  const stockValue = parts.reduce((total, part) => total + part.stock * part.cost_cents, 0);
  const openForm = params.new === "1";

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Parts on the shelf, reorder levels, and what each repair actually costs."
        actions={<PrimaryLink href="/inventory?new=1">Add part</PrimaryLink>}
      />
      <Feedback notice={params.notice} error={params.error} />

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Panel className="px-5 py-4">
          <p className="text-[11px] text-muted">Parts tracked</p>
          <p className="figure mt-1 text-[26px] font-semibold tracking-[-0.04em] text-ink">{parts.length}</p>
        </Panel>
        <Panel className="px-5 py-4">
          <p className="text-[11px] text-muted">Low stock</p>
          <p className="figure mt-1 text-[26px] font-semibold tracking-[-0.04em] text-warn">{lowStock.length}</p>
        </Panel>
        <Panel className="px-5 py-4">
          <p className="text-[11px] text-muted">Stock value at cost</p>
          <p className="figure mt-1 text-[26px] font-semibold tracking-[-0.04em] text-ink">{formatMoney(stockValue)}</p>
        </Panel>
      </div>

      {openForm ? (
        <Panel className="reveal mt-4 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-medium text-ink">Add a part</h2>
              <p className="mt-0.5 text-[12px] text-muted">New inventory is available to tickets immediately.</p>
            </div>
            <Link href="/inventory" className="text-[12px] text-muted hover:text-ink">
              Close
            </Link>
          </div>
          <form action={addPartAction} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FormField id="sku" name="sku" label="SKU" placeholder="SCR-IP15-OEM" required />
              <FormField id="name" name="name" label="Part name" placeholder="iPhone 15 OLED assembly" required className="lg:col-span-2" />
              <SelectField id="category" name="category" label="Category" defaultValue="general">
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category[0].toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </SelectField>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <FormField id="stock" name="stock" type="number" min={0} label="Stock" defaultValue={0} />
              <FormField id="reorder_level" name="reorder_level" type="number" min={0} label="Reorder at" defaultValue={2} />
              <FormField id="cost" name="cost" label="Cost" inputMode="decimal" placeholder="0.00" />
              <FormField id="price" name="price" label="Sell price" inputMode="decimal" placeholder="0.00" />
              <FormField id="supplier" name="supplier" label="Supplier" placeholder="Optional" />
            </div>
            <div className="flex justify-end border-t border-line pt-4">
              <SubmitButton pendingText="Adding...">Add to inventory</SubmitButton>
            </div>
          </form>
        </Panel>
      ) : null}

      <Panel className="mt-4 overflow-hidden">
        <form className="flex flex-wrap items-center gap-2 border-b border-line p-4">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">Search inventory</span>
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Search part, SKU, category, supplier"
              className="h-9 w-full rounded-lg border border-line bg-paper px-3 text-[12px] text-ink outline-none placeholder:text-muted/60 focus:border-accent"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center rounded-full bg-ink px-4 text-[12px] font-semibold text-paper hover:bg-white"
          >
            Search
          </button>
          {params.q ? (
            <Link href="/inventory" className="inline-flex h-9 items-center rounded-full border border-line px-3 text-[12px] text-muted hover:text-ink">
              Clear
            </Link>
          ) : null}
        </form>

        <div className="hidden grid-cols-[1.6fr_0.7fr_0.7fr_0.7fr_0.8fr] gap-4 border-b border-line px-5 py-2.5 text-[10px] text-muted lg:grid">
          <span>Part</span>
          <span>Stock</span>
          <span>Reorder at</span>
          <span>Price</span>
          <span className="text-right">Adjust</span>
        </div>

        <div className="divide-y divide-line">
          {parts.length === 0 ? (
            <p className="px-5 py-8 text-center text-[12px] text-muted">No parts match that search.</p>
          ) : (
            parts.map((part) => {
              const low = part.stock <= part.reorder_level;
              return (
                <div key={part.id} className="grid gap-3 px-5 py-4 lg:grid-cols-[1.6fr_0.7fr_0.7fr_0.7fr_0.8fr] lg:items-center lg:gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-[13px] font-medium text-ink">{part.name}</p>
                      {low ? (
                        <span className="rounded-full bg-warn-soft px-2 py-0.5 text-[9px] font-medium text-warn">
                          {part.stock === 0 ? "Out" : "Low"}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-[10px] text-muted">
                      {part.sku} · {part.category}
                      {part.supplier ? ` · ${part.supplier}` : ""}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-2 lg:justify-start">
                      <span className="figure text-[12px] text-ink">{part.stock}</span>
                      <span className="text-[10px] text-muted lg:hidden">in stock</span>
                    </div>
                    <div className="mt-1.5 max-w-[120px]">
                      <DataBar value={part.stock} max={Math.max(part.reorder_level * 2, part.stock)} tone={low ? "bg-warn" : "bg-positive"} />
                    </div>
                  </div>
                  <p className="figure text-[12px] text-muted">{part.reorder_level}</p>
                  <div>
                    <p className="figure text-[12px] text-ink">{formatMoney(part.price_cents)}</p>
                    <p className="text-[10px] text-muted">cost {formatMoney(part.cost_cents)}</p>
                  </div>
                  <div className="flex gap-2 lg:justify-end">
                    <form action={adjustStockAction}>
                      <input type="hidden" name="part_id" value={part.id} />
                      <input type="hidden" name="delta" value="-1" />
                      <button
                        type="submit"
                        disabled={part.stock === 0}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-line text-[14px] text-muted hover:border-negative/40 hover:text-negative disabled:opacity-30"
                        aria-label={`Remove one ${part.name}`}
                      >
                        −
                      </button>
                    </form>
                    <form action={adjustStockAction}>
                      <input type="hidden" name="part_id" value={part.id} />
                      <input type="hidden" name="delta" value="1" />
                      <button
                        type="submit"
                        className="grid h-8 w-8 place-items-center rounded-lg border border-line text-[14px] text-muted hover:border-positive/40 hover:text-positive"
                        aria-label={`Add one ${part.name}`}
                      >
                        +
                      </button>
                    </form>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Panel>

      <p className="mt-4 text-[11px] text-muted">
        Stock moves automatically when a part is attached to a ticket. Manual adjustments are owner-controlled.
      </p>
    </div>
  );
}
