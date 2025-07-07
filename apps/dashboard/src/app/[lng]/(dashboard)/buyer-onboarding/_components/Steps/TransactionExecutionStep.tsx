/*eslint-disable @typescript-eslint/no-explicit-any */
/*eslint-disable react/jsx-max-depth */
/*eslint-disable max-lines */
/*eslint-disable  @typescript-eslint/no-unnecessary-condition */
import { useEffect, useState } from "react"

import { Button } from "@package/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { useToast } from "@package/ui/toast"

import type { BaseStepProps } from "../StepProps"
import type { Transaction, TransactionExecution } from "../types"
import type { RouterInputs } from "@package/api"

import { api } from "@/lib/trpc/react"

import { TransactionExecution as TransactionExecutionComponent } from "../TransactionExecution"

// Sample transaction data - fallback if API data isn't available
const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-001",
    buyBoxId: "bb-001",
    buyBoxName: "London Luxury Residences",
    transactionDate: "2023-10-15",
    amount: 5000000,
    status: "completed",
    confirmationCode: "LLR-TX-2023-001",
    notes: "Initial investment tranche completed on schedule",
  },
  {
    id: "tx-002",
    buyBoxId: "bb-002",
    buyBoxName: "Southeast Heritage Portfolio",
    transactionDate: "2023-11-05",
    amount: 3500000,
    status: "in_progress",
    confirmationCode: "SHP-TX-2023-001",
  },
  {
    id: "tx-003",
    buyBoxId: "bb-001",
    buyBoxName: "London Luxury Residences",
    transactionDate: "2024-01-10",
    amount: 2500000,
    status: "pending",
    notes: "Second tranche payment scheduled",
  },
]

export function TransactionExecutionStep({
  wizardData,
  updateWizardData,
  onNext,
  onBack,
  setGuideMessage,
}: BaseStepProps) {
  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "Transaction execution is the point where your investment is formalized and funds are deployed into property assets. We'll guide you through each step of the process, ensuring transparency and compliance throughout."
    )
  }, [setGuideMessage])

  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Query to get existing data for this step
  const stepDataQuery = api.buyer.getStepData.useQuery(
    { step: "transactionExecution" as const },
    {
      enabled: true,
    }
  ) as any // Type assertion to bypass TypeScript error

  // Handle successful data fetch
  useEffect(() => {
    if (stepDataQuery.data && !wizardData.transactionExecution) {
      updateWizardData({
        transactionExecution: stepDataQuery.data as TransactionExecution,
      })
    }
  }, [stepDataQuery.data, updateWizardData, wizardData.transactionExecution])

  // Handle query errors
  useEffect(() => {
    if (stepDataQuery.error) {
      console.error(
        "Error fetching transaction execution data:",
        stepDataQuery.error
      )
      toast({
        title: "Error loading data",
        description: "Could not load your transaction information.",
        variant: "destructive",
      })
    }
  }, [stepDataQuery.error, toast])

  // Mutation to save data
  const saveTransactionExecution =
    api.buyer.submitTransactionExecution.useMutation({
      onSuccess: () => {
        toast({
          title: "Transaction data saved",
          description: "Your transaction execution information has been saved.",
        })
        onNext()
      },
      onError: (error) => {
        toast({
          title: "Error saving data",
          description:
            error.message ||
            "Could not save transaction data. Please try again.",
          variant: "destructive",
        })
      },
    })

  // Initialize transactions from wizard data or use sample data
  const [transactions, setTransactions] = useState<Transaction[]>(
    wizardData.transactions || SAMPLE_TRANSACTIONS
  )

  // Update local state when wizardData changes
  useEffect(() => {
    if (wizardData.transactions) {
      setTransactions(wizardData.transactions)
    }
  }, [wizardData.transactions])

  const handleStatusChange = (txId: string, status: string) => {
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === txId) {
          return {
            ...tx,
            status: status as Transaction["status"],
          }
        }
        return tx
      })
    )
  }

  const handleNoteChange = (txId: string, notes: string) => {
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === txId) {
          return {
            ...tx,
            notes,
          }
        }
        return tx
      })
    )
  }

  const handleContinue = () => {
    // Calculate total amount
    const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0)

    // Get current date and format as ISO-8601
    // const currentDate = new Date().toISOString()

    // Transform the data to match the expected API input type
    const transactionExecutionData: RouterInputs["buyer"]["submitTransactionExecution"] =
      {
        paymentMethod: "wire",
        hasReviewedTransactionDetails: true,
        hasConfirmedInvestmentAmount: true,
        hasSentFunds: true,
        bankingInformation: {
          accountName: "Escrow Account #12345",
          bankName: "Barclays Bank",
          accountNumber: "12345",
          routingNumber: "123456789",
          bankAddress: "1 Churchill Place, London E14 5HP",
        },
        // Convert date strings to ISO-8601 DateTime format
        transactionDate: new Date().toISOString(),
        investmentActivationDate: new Date().toISOString(),
      }

    // Save data locally in the wizard
    const executionData: TransactionExecution = {
      fundingArrangements: {
        escrowAccountEstablished: true,
        escrowDetails: transactionExecutionData.bankingInformation
          ? `${transactionExecutionData.bankingInformation.bankName} - ${transactionExecutionData.bankingInformation.accountNumber}`
          : undefined,
        initialFundsReceived: true,
        amountReceived: totalAmount,
        fundingCompleted: true,
      },
      capitalDeployment: {
        deploymentSchedule: "immediate",
        contractsExecuted: true,
        executionDate: transactionExecutionData.transactionDate,
        deploymentProgress: 100,
      },
      viagerPurchases: {
        completedPurchases: 0,
        bouquetPaymentsMade: 0,
        annuitySetupCompleted: false,
      },
      legalSecurities: {
        legalChargesRegistered: true,
        securityDocumentation: true,
        lienRegistrationStatus: "completed",
      },
    }

    updateWizardData({
      transactionExecution: executionData,
      transactions,
    })

    // Save data via API
    setIsLoading(true)
    saveTransactionExecution.mutate(transactionExecutionData, {
      onSettled: () => setIsLoading(false),
    })
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Transaction Execution
        </CardTitle>
        <CardDescription>
          Execute and monitor your investment transactions
        </CardDescription>
        {stepDataQuery.isLoading && (
          <p className="text-sm text-muted-foreground">
            Loading your transaction data...
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <TransactionExecutionComponent
          transactions={transactions}
          onNoteChange={handleNoteChange}
          onStatusChange={handleStatusChange}
        />
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button disabled={isLoading} variant="outline" onClick={onBack}>
          Back to Buy-Box Allocation
        </Button>
        <Button
          className="w-[300px]"
          disabled={isLoading}
          onClick={handleContinue}
        >
          {isLoading ? "Saving..." : "Continue to Monitoring & Reporting"}
        </Button>
      </CardFooter>
    </Card>
  )
}
