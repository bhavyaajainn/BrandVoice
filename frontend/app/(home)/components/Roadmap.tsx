import React from 'react'
import { motion } from "framer-motion"
import { timeline } from '@/lib/data'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'

const Roadmap = () => {
  return (
    <section id="roadmap" className="py-24 bg-gray-50">
    <div className="max-w-4xl mx-auto px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Development Roadmap</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Our planned features and milestones for this hackathon project
        </p>
      </motion.div>

      <div className="space-y-8">
        {timeline.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-start space-x-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white`}>
                {item.icon}
              </div>
            </div>
            <motion.div
              className="flex-1"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      {item.quarter}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  )
}

export default Roadmap