import { Button } from '@/components/ui/button'
import { Import } from 'lucide-react'
import React from 'react'

const SchedulerNav = ({ setShowImportDialog }: { setShowImportDialog: (show: boolean) => void }) => {
    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-2xl font-bold text-gray-900">Smart Scheduler</h1>
                        <p className="text-gray-600 mt-1">Schedule and manage your content across multiple platforms</p>
                    </div>
                    <div>
                        <Button onClick={() => setShowImportDialog(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Import className="w-4 h-4 mr-2" />
                            Import Content
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SchedulerNav