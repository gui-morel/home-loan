import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    lng: "fr",
    fallbackLng: "gb",
    interpolation: {
        escapeValue: false,
    },
    resources: {
        gb: {
            translation: {
                title: 'Home Loan',
                multiHomeLoan: 'Grouped Home Loan',
                homeLoan: 'Home Loan',
                investment: 'Investment',
                amount: 'Amount',
                rate: 'Rate',
                monthCount: 'Month count',
                loanCost: 'Loan cost',
                loanBeggin: 'Loan beggin',
                loanEnd: 'Loan end',
                amortizationSchedule: 'Amortization Schedule',
                date: 'Date',
                month: 'Month',
                outstandingLoanBalance: 'Outstanding Loan Balance',
                monthlyPayment: 'Monthly Payment (Principal + Interest)',
                principalToDate: 'Principal to Date',
                interestToDate: 'Interest to Date',
            }
        },
        fr: {
            translation: {
                title: 'Crédit Immobilier',
                multiHomeLoan: 'Crédit Immobilier Groupé',
                homeLoan: 'Crédit Immobilier',
                investment: 'Investissement',
                amount: 'Montant',
                rate: 'Taux',
                monthCount: 'Nombre de Mensualité',
                loanCost: 'Coût du crédit',
                loanBeggin: 'Début du crédit',
                loanEnd: 'Fin du crédit',
                amortizationSchedule: 'Échéancier',
                date: 'Date',
                month: 'Mois',
                outstandingLoanBalance: 'Montant restant à rembourser',
                monthlyPayment: 'Mensualité (Capital + Intérêt )',
                principalToDate: 'Capital à date',
                interestToDate: 'Intérêt à date',
            }
        },
    }

});

export default i18n;
