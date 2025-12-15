import { Header } from "../../components/header"
import { ChooseBase } from "../../components/how-it-works/choose-base"
import { ChooseAccompaniments } from "../../components/how-it-works/choose-accompaniments"
import { AddSupplements } from "../../components/how-it-works/add-supplements"
import { DynamicPricing } from "../../components/how-it-works/dynamic-pricing"
import { IntuitiveExperience } from "../../components/how-it-works/intuitive-experience"
import { Conclusion } from "../../components/how-it-works/conclusion"
import { Footer } from "../../components/footer"



export default function CommentCaMarchePage() {
  return (
    <div className="min-h-screen flex flex-col">
     
       <Header />

      {/* Hero Section */}
      <section className="py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Comment personnaliser votre repas chez Cube
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          Personnaliser votre repas est simple. En trois étapes, vous créez un plat qui vous correspond pleinement.
        </p>
      </section>

      {/* Introduction */}
      <section className="py-8 text-center">
        <h2 className="text-2xl font-bold text-orange-500 mb-4">Introduction</h2>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          Personnaliser votre repas est simple. En trois étapes, vous créez un plat qui vous correspond pleinement.
        </p>
      </section>

      {/* Step 1: Choose Base */}
      <ChooseBase />

      {/* Step 2: Choose Accompaniments */}
      <ChooseAccompaniments />

      {/* Step 3: Add Supplements */}
      <AddSupplements />

      {/* Dynamic Pricing */}
      <DynamicPricing />

      {/* Intuitive Experience */}
      <IntuitiveExperience />

      {/* Conclusion */}
      <Conclusion />
      <Footer />
    </div>
  )
}
