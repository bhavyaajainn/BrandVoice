import React from 'react'
import { motion } from "framer-motion"
import { team } from '@/lib/data'
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin } from 'lucide-react'

const Team = () => {
    return (
        <section id="team" className="py-24">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet the Team</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        The brilliant minds behind the creation of BrandVoice AI
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {team.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -4 }}
                        >
                            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-8 text-center">
                                    <div
                                        className={`w-16 h-16 ${member.color} rounded-full mx-auto mb-4 flex items-center justify-center`}
                                    >
                                        <span className="text-lg font-semibold">{member.initial}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{member.name}</h3>
                                    <p className="text-gray-600">{member.role}</p>
                                    <div className="flex justify-center mt-4">
                                        {member.socials.map((social, socialIndex) => (
                                            <a
                                                key={socialIndex}
                                                href={social.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mx-2 text-gray-600 hover:text-gray-900"
                                            >
                                                <Linkedin width={20} height={20} className="text-gray-600 hover:text-gray-900" />
                                            </a>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Team