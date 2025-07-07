/*eslint-disable @typescript-eslint/no-explicit-any */
/*eslint-disable react/jsx-max-depth */
/*eslint-disable max-lines */
/*eslint-disable  @typescript-eslint/no-unnecessary-condition */
import { useState } from "react"

import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Input } from "@package/ui/input"
import { Label } from "@package/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@package/ui/table"
import { ArrowUpCircle, CheckCircle2, Clock, XCircle } from "lucide-react"

import type { Transaction } from "./types"

interface TransactionExecutionProps {
  transactions: Transaction[]
  onStatusChange?: (txId: string, status: string) => void
  onNoteChange?: (txId: string, note: string) => void
  onTransactionUpdate?: (transaction: Transaction) => void
}

export function TransactionExecution({
  transactions,
  onStatusChange,
  onNoteChange,
}: TransactionExecutionProps) {
  const [expandedTransactionId, setExpandedTransactionId] = useState<
    string | null
  >(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="flex items-center gap-1 bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="size-3" />
            Pending
          </Badge>
        )
      case "in_progress":
        return (
          <Badge className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
            <ArrowUpCircle className="size-3" />
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="size-3" />
            Completed
          </Badge>
        )
      case "failed":
        return (
          <Badge className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="size-3" />
            Failed
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400">
            {status}
          </Badge>
        )
    }
  }

  const toggleExpanded = (txId: string) => {
    if (expandedTransactionId === txId) {
      setExpandedTransactionId(null)
    } else {
      setExpandedTransactionId(txId)
    }
  }

  const handleStatusChange = (txId: string, newStatus: string) => {
    onStatusChange?.(txId, newStatus)
  }

  const handleNoteChange = (txId: string, note: string) => {
    onNoteChange?.(txId, note)
  }

  const calculateTotalAmount = () => {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Transaction Execution
        </CardTitle>
        <CardDescription>
          Monitor and manage your property investment transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-muted-foreground">
              Total Transactions: {transactions.length}
            </span>
          </div>
          <div>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(calculateTotalAmount())}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Buy-Box</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <>
                  <TableRow
                    key={tx.id}
                    className="cursor-pointer hover:bg-muted/10"
                    onClick={() => toggleExpanded(tx.id)}
                  >
                    <TableCell>{formatDate(tx.transactionDate)}</TableCell>
                    <TableCell>
                      <span className="font-medium">{tx.buyBoxName}</span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(tx.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExpanded(tx.id)
                        }}
                      >
                        {expandedTransactionId === tx.id ? "Hide" : "Details"}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedTransactionId === tx.id && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="p-4">
                          <div className="mb-4 grid gap-4 md:grid-cols-3">
                            <div>
                              <Label className="mb-1 block">
                                Transaction ID
                              </Label>
                              <div className="rounded-md bg-muted/20 p-2 text-sm">
                                {tx.id}
                              </div>
                            </div>
                            <div>
                              <Label className="mb-1 block">Buy-Box ID</Label>
                              <div className="rounded-md bg-muted/20 p-2 text-sm">
                                {tx.buyBoxId}
                              </div>
                            </div>
                            {tx.confirmationCode && (
                              <div>
                                <Label className="mb-1 block">
                                  Confirmation Code
                                </Label>
                                <div className="rounded-md bg-muted/20 p-2 text-sm">
                                  {tx.confirmationCode}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mb-4 grid gap-4 md:grid-cols-2">
                            <div>
                              <Label
                                className="mb-1 block"
                                htmlFor={`status-${tx.id}`}
                              >
                                Status
                              </Label>
                              <Select
                                value={tx.status}
                                onValueChange={(value) =>
                                  handleStatusChange(tx.id, value)
                                }
                              >
                                <SelectTrigger
                                  className="w-full"
                                  id={`status-${tx.id}`}
                                >
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="in_progress">
                                    In Progress
                                  </SelectItem>
                                  <SelectItem value="completed">
                                    Completed
                                  </SelectItem>
                                  <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label
                                className="mb-1 block"
                                htmlFor={`notes-${tx.id}`}
                              >
                                Transaction Notes
                              </Label>
                              <Input
                                id={`notes-${tx.id}`}
                                placeholder="Add notes about this transaction..."
                                value={tx.notes || ""}
                                onChange={(e) =>
                                  handleNoteChange(tx.id, e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleExpanded(tx.id)
                              }}
                            >
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
