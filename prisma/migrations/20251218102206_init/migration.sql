-- CreateEnum
CREATE TYPE "Role" AS ENUM ('staff', 'parent');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('Normal', 'Delayed', 'In_Progress');

-- CreateEnum
CREATE TYPE "ADLStatus" AS ENUM ('Independent', 'Dependent', 'In_Progress');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('Monthly', 'Quarterly', 'Screening');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('Draft', 'Approved');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "linked_student_id" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "ipp_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "blood_group" TEXT,
    "gender" TEXT NOT NULL,
    "address" TEXT,
    "parent_names" TEXT NOT NULL,
    "parent_contact" TEXT NOT NULL,
    "disability_type" TEXT,
    "referral_doctor" TEXT,
    "active_status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clinical_History" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "siblings_details" TEXT,
    "family_structure" TEXT,
    "home_language" TEXT,
    "consanguinity" BOOLEAN NOT NULL DEFAULT false,
    "pregnancy_duration" TEXT,
    "delivery_nature" TEXT,
    "birth_weight" TEXT,
    "birth_cry" TEXT,
    "history_seizures" BOOLEAN NOT NULL DEFAULT false,
    "history_respiratory" BOOLEAN NOT NULL DEFAULT false,
    "current_medications" TEXT,
    "allergies" TEXT,
    "age_disability_noticed" TEXT,

    CONSTRAINT "Clinical_History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Developmental_Milestones" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "social_smile" "MilestoneStatus",
    "neck_control" "MilestoneStatus",
    "sitting" "MilestoneStatus",
    "crawling" "MilestoneStatus",
    "standing" "MilestoneStatus",
    "walking" "MilestoneStatus",
    "speech_initiation" "MilestoneStatus",

    CONSTRAINT "Developmental_Milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Daily_Living_Skills" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "eating" "ADLStatus",
    "dressing" "ADLStatus",
    "toileting" "ADLStatus",

    CONSTRAINT "Daily_Living_Skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clinical_Observations" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "general_appearance" TEXT,
    "psychomotor_skills" TEXT,
    "sensory_issues" TEXT,
    "cognition_memory" TEXT,
    "communication_expressive" TEXT,
    "communication_receptive" TEXT,
    "social_interaction" TEXT,

    CONSTRAINT "Clinical_Observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "type" "ReportType" NOT NULL,
    "summary_text" TEXT,
    "file_url" TEXT,
    "created_by" INTEGER NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'Draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_ipp_number_key" ON "Student"("ipp_number");

-- CreateIndex
CREATE UNIQUE INDEX "Clinical_History_student_id_key" ON "Clinical_History"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Developmental_Milestones_student_id_key" ON "Developmental_Milestones"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Daily_Living_Skills_student_id_key" ON "Daily_Living_Skills"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Clinical_Observations_student_id_key" ON "Clinical_Observations"("student_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_linked_student_id_fkey" FOREIGN KEY ("linked_student_id") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clinical_History" ADD CONSTRAINT "Clinical_History_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Developmental_Milestones" ADD CONSTRAINT "Developmental_Milestones_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Daily_Living_Skills" ADD CONSTRAINT "Daily_Living_Skills_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clinical_Observations" ADD CONSTRAINT "Clinical_Observations_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
