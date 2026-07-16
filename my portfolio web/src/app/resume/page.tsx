'use client'

import { useEffect } from 'react'
import { Download } from 'lucide-react'

const skills = {
  'Programming': ['Python', 'SQL'],
  'Data Analysis': ['Pandas', 'NumPy', 'Data Cleaning', 'Exploratory Data Analysis', 'Statistical Analysis'],
  'Visualization': ['Power BI', 'Excel Dashboards', 'Matplotlib', 'Data Storytelling'],
  'Databases': ['MySQL', 'SQL Server'],
  'Tools': ['Git', 'GitHub', 'Jupyter Notebook', 'VS Code'],
}

const projects = [
  {
    title: 'Sales Performance Analytics Dashboard',
    tech: 'Python, Pandas, SQL, Power BI',
    desc: 'Built interactive dashboards connecting SQL databases to Power BI with automated ETL pipelines. Identified top product categories driving 60% of revenue, improved forecast accuracy by 25%, and reduced reporting time from 4 hours to 15 minutes.',
  },
  {
    title: 'Customer Churn Analysis',
    tech: 'Python, Pandas, Machine Learning',
    desc: 'Built a classification model to predict churn risk, identifying 5 key factors driving 80% of churn cases. Achieved 85% accuracy in detecting at-risk customers 30 days in advance, reducing churn rate by 22%.',
  },
  {
    title: 'HR Analytics Dashboard',
    tech: 'Power BI, Excel, SQL',
    desc: 'Developed an interactive dashboard consolidating employee data with drill-down capabilities. Uncovered department-specific attrition trends and tracked KPI performance across 12 real-time metrics.',
  },
  {
    title: 'Python Data Cleaning Automation',
    tech: 'Python, Pandas',
    desc: 'Developed reusable automation scripts handling missing values, format standardization, outlier detection, and cleaning reports. Automated 90% of repetitive cleaning tasks, reducing prep time by 70%.',
  },
  {
    title: 'TechMart Sales Analysis',
    tech: 'Python, Pandas, Matplotlib, Seaborn',
    desc: 'Performed comprehensive sales analytics on 5,000 records including trend analysis, regional comparison, product ranking, salesperson evaluation, and discount impact correlation. Identified seasonal patterns, a 3.2x regional performance gap, and weak discount-volume correlation, delivering 5 strategic recommendations.',
  },
  {
    title: 'GlobalRetail Data Analysis',
    tech: 'Python, Pandas, Jupyter Notebook, Machine Learning',
    desc: 'Conducted end-to-end retail analytics on 50,000 orders covering YoY trends, profitability, customer segmentation (RFM), returns analysis, shipping/payment analysis, and logistic regression. Discovered 2.8% YoY revenue decline and 24.94% return rate causing $4.5M lost profit.',
  },
]

export default function ResumePage() {
  useEffect(() => {
    document.title = 'Usman Ashfaq - Resume'
  }, [])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 print:py-0 print:px-0 print:bg-white">
      {/* Print/Download controls */}
      <div className="max-w-4xl mx-auto mb-4 text-right print:hidden">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all shadow-lg"
        >
          <Download size={18} /> Download PDF
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Click to open print dialog, then select &quot;Save as PDF&quot;
        </p>
      </div>

      {/* Resume content */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl print:shadow-none rounded-xl print:rounded-none overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B1120] to-[#151F36] px-8 py-10 print:px-6 print:py-8">
          <h1 className="text-3xl font-extrabold text-white font-heading">Usman Ashfaq</h1>
          <p className="text-lg text-blue-300 font-medium mt-1">Data Analyst | Python Developer | SQL | Power BI Specialist</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-sm text-gray-300">
            <span>usman.ashfaq1916@gmail.com</span>
            <span>github.com/usmanashfaq1916</span>
            <span>linkedin.com/in/usman-ashfaq</span>
            <span>+92 324 4776493</span>
          </div>
        </div>

        <div className="px-8 py-8 print:px-6 print:py-6 space-y-7">
          {/* Professional Summary */}
          <section>
            <h2 className="text-base font-bold text-[#0B1120] font-heading border-b-2 border-blue-600 pb-1 mb-3">
              Professional Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Data Analyst with hands-on expertise in Python, SQL, Power BI, and Excel. I specialize in analyzing
              complex datasets, building automated data solutions, creating interactive dashboards, and delivering
              meaningful insights that drive business decisions. Experienced in end-to-end analytics workflows —
              from data cleaning and exploratory analysis to visualization and reporting.
            </p>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-base font-bold text-[#0B1120] font-heading border-b-2 border-blue-600 pb-1 mb-3">
              Technical Skills
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1.5">{category}</h3>
                  <ul className="space-y-0.5">
                    {items.map((skill) => (
                      <li key={skill} className="text-sm text-gray-700">{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section>
            <h2 className="text-base font-bold text-[#0B1120] font-heading border-b-2 border-blue-600 pb-1 mb-3">
              Featured Projects
            </h2>
            <div className="space-y-4">
              {projects.map((p) => (
                <div key={p.title}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-gray-900">{p.title}</h3>
                    <span className="text-xs text-blue-600 whitespace-nowrap font-medium">{p.tech}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Education & Certifications */}
          <div className="grid sm:grid-cols-2 gap-6">
            <section>
              <h2 className="text-base font-bold text-[#0B1120] font-heading border-b-2 border-blue-600 pb-1 mb-3">
                Education
              </h2>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Master of Computer Science (MCS)</h3>
                <p className="text-sm text-gray-600">Virtual University of Pakistan</p>
              </div>
            </section>
            <section>
              <h2 className="text-base font-bold text-[#0B1120] font-heading border-b-2 border-blue-600 pb-1 mb-3">
                Certifications
              </h2>
              <ul className="space-y-1">
                <li className="text-sm text-gray-700">Python Programming — DataCamp</li>
                <li className="text-sm text-gray-700">SQL Database — DataCamp</li>
                <li className="text-sm text-gray-700">Power BI — Microsoft Learn</li>
                <li className="text-sm text-gray-700">Data Analytics — Google Analytics Academy</li>
                <li className="text-sm text-gray-700">Machine Learning — Kaggle</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
