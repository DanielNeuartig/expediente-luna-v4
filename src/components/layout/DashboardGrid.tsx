// src/components/layout/DashboardGrid.tsx
"use client"

import { Grid, GridProps } from "@chakra-ui/react"

export default function DashboardGrid({ children, ...props }: GridProps) {
  return (
    <Grid
  templateColumns="repeat(2, 1fr)"
      gap={6}
        alignItems="start"
      {...props}
    >
      {children}
    </Grid>
  )
}