"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"

import { ExpenseItem } from "@/lib/expense"

import { saveExpenseList } from "@/lib/expense"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

interface ExpenseTableProps {
  onCalculate: (totalExpense: number) => void
}

export default function ExpenseTable({ onCalculate }: ExpenseTableProps) {
  const [items, setItems] = useState<ExpenseItem[]>([{ 
    id: "1", 
    name: "", 
    price: "", 
    quantity: "1",
    timestamp: Date.now()
  }])
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const addRow = () => {
    const newItem: ExpenseItem = {
      id: Date.now().toString(),
      name: "",
      price: "",
      quantity: "1",
      timestamp: Date.now()
    }
    setItems([...items, newItem])
  }

  const removeRow = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof ExpenseItem, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const calculateTotal = async () => {
    const total = items.reduce((sum, item) => {
      const price = Number.parseFloat(item.price) || 0
      const quantity = Number.parseInt(item.quantity) || 0
      return sum + price * quantity
    }, 0)

    onCalculate(total)

    if (user && items.some(item => item.name && item.price)) {
      try {
        setIsSaving(true)
        await saveExpenseList(user.uid, items, total)
        toast({
          title: "Success",
          description: "Expense list saved successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save expense list",
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
    }
  }

  const getItemTotal = (item: ExpenseItem) => {
    const price = Number.parseFloat(item.price) || 0
    const quantity = Number.parseInt(item.quantity) || 0
    return price * quantity
  }

  return (
    <Card className="dark:bg-neutral-900 dark:border-neutral-700">
      <CardHeader>
        <CardTitle className="text-envesto-navy dark:text-neutral-100">Expense Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 font-medium text-envesto-gray-700 dark:text-neutral-300 text-sm">
            <div className="col-span-4">Product Name</div>
            <div className="col-span-3">Price (₹)</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Total (₹)</div>
            <div className="col-span-1">Action</div>
          </div>

          {/* Table Rows */}
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">
                <Input
                  placeholder="Enter product name"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, "name", e.target.value)}
                  className="dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700"
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, "price", e.target.value)}
                  min="0"
                  step="0.01"
                  className="dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                  min="1"
                  className="dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700"
                />
              </div>
              <div className="col-span-2">
                <div className="px-3 py-2 bg-envesto-gray-50 dark:bg-neutral-800 dark:text-neutral-100 dark:border dark:border-neutral-700 rounded text-sm font-medium">
                  ₹{getItemTotal(item).toFixed(2)}
                </div>
              </div>
              <div className="col-span-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(item.id)}
                  disabled={items.length === 1}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={addRow}
              variant="outline"
              className="border-envesto-teal dark:border-envesto-teal text-envesto-teal hover:bg-envesto-teal hover:text-white bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>
            <Button 
              onClick={calculateTotal} 
              className="bg-envesto-teal hover:bg-envesto-teal/90 text-white border-2 border-transparent dark:border-envesto-teal/70"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Calculate & Save'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
