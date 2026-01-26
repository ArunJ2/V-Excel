import prisma from '../config/database.js';
export const saveRecordVersion = async (req, res) => {
    const { student_id, entity_type, data, change_reason } = req.body;
    const changed_by = req.user.id;
    try {
        // 1. Get current version
        const lastVersion = await prisma.recordVersion.findFirst({
            where: { entity_type, entity_id: parseInt(student_id) },
            orderBy: { version_number: 'desc' }
        });
        const nextVersion = (lastVersion?.version_number || 0) + 1;
        // 2. Save version
        const version = await prisma.recordVersion.create({
            data: {
                entity_type,
                entity_id: parseInt(student_id),
                version_number: nextVersion,
                data: JSON.stringify(data),
                changed_by,
                change_reason
            }
        });
        // 3. Update active record
        const sid = parseInt(student_id);
        switch (entity_type) {
            case 'clinical_history':
                await prisma.clinicalHistory.upsert({
                    where: { student_id: sid },
                    update: data,
                    create: { ...data, student_id: sid }
                });
                break;
            case 'milestones':
                await prisma.developmentalMilestones.upsert({
                    where: { student_id: sid },
                    update: data,
                    create: { ...data, student_id: sid }
                });
                break;
            case 'adl':
                await prisma.dailyLivingSkills.upsert({
                    where: { student_id: sid },
                    update: data,
                    create: { ...data, student_id: sid }
                });
                break;
            case 'observations':
                await prisma.clinicalObservations.upsert({
                    where: { student_id: sid },
                    update: data,
                    create: { ...data, student_id: sid }
                });
                break;
        }
        res.status(201).json(version);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const getRecordVersions = async (req, res) => {
    const { entityType, entityId } = req.params;
    try {
        const versions = await prisma.recordVersion.findMany({
            where: {
                entity_type: entityType,
                entity_id: parseInt(entityId)
            },
            include: { changed_by_user: { select: { name: true } } },
            orderBy: { version_number: 'desc' }
        });
        res.json(versions);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
