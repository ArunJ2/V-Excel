import prisma from '../config/database.js';
export const getCenterStats = async (req, res) => {
    try {
        const totalStudents = await prisma.student.count();
        const activeStudents = await prisma.student.count({ where: { active_status: true } });
        const allStudents = await prisma.student.findMany({
            select: { attendance: true }
        });
        const avgAttendance = allStudents.length > 0
            ? Math.round(allStudents.reduce((acc, s) => acc + s.attendance, 0) / allStudents.length)
            : 0;
        // Get count by disability type
        const disabilityDist = await prisma.student.groupBy({
            by: ['disability_type'],
            _count: {
                id: true
            }
        });
        // Get upcoming events (next 5)
        const upcomingEvents = await prisma.event.findMany({
            where: {
                date: {
                    gte: new Date()
                }
            },
            orderBy: {
                date: 'asc'
            },
            take: 5
        });
        res.json({
            totalStudents,
            activeStudents,
            avgAttendance,
            disabilityDist: disabilityDist.map(d => ({
                type: d.disability_type || 'Unspecified',
                count: d._count.id
            })),
            upcomingEvents
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const createEvent = async (req, res) => {
    const { title, description, date, location, type } = req.body;
    try {
        const event = await prisma.event.create({
            data: {
                title,
                description,
                date: new Date(date),
                location,
                type
            }
        });
        res.status(201).json(event);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, date, location, type } = req.body;
    try {
        const event = await prisma.event.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                date: new Date(date),
                location,
                type
            }
        });
        res.json(event);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.event.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Event deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Accessible by ALL authenticated users (including parents)
export const getUpcomingEvents = async (req, res) => {
    try {
        const upcomingEvents = await prisma.event.findMany({
            where: {
                date: {
                    gte: new Date()
                }
            },
            orderBy: {
                date: 'asc'
            },
            take: 10
        });
        res.json(upcomingEvents);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
