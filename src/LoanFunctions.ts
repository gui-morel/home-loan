export const monthlyPayment = (loanAmount: number, loaRrate: number, mensualityCount: number) =>
    ((loanAmount * loaRrate) / 12) / (1 - Math.pow((1 + (loaRrate / 12)), -mensualityCount))


export const interestPayment = (loanAmount: number, loanRate: number, mensualityPerYear: number = 12) =>
    (loanAmount * (loanRate / mensualityPerYear))
