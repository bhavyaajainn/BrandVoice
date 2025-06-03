import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Calendar, Globe, MessageSquare, Settings } from 'lucide-react'

const Actions = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2 cursor-pointer">
                        <MessageSquare className="w-5 h-5" />
                        <span>Create Content</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2 cursor-pointer">
                        <Globe className="w-5 h-5" />
                        <span>Connect Channel</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2 cursor-pointer">
                        <Calendar className="w-5 h-5" />
                        <span>Schedule Post</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2 cursor-pointer">
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default Actions