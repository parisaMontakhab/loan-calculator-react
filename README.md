# Loan Installment Calculator

A simple and user-friendly loan installment calculator built with React, JavaScript and Tailwind CSS.

## Features

- Loan amount input
- TAN selection: 7%, 7.5%, 8%
- Duration selection: 36, 48, 60 months
- Setup fee and insurance included in the financed amount
- Monthly installment calculation
- Total repayment calculation
- Responsive and clean UI

## Technical Choice

I decided to finance both the setup fee and the insurance inside the total loan amount.

This means:

```text
Financed amount = Requested amount + Setup fee + Insurance
