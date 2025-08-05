import { PrismaClient, ProjectStatus, WorkItemStatus, EquipmentStatus, WorkerStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Dự án Nhà cao tầng ABC',
      description: 'Xây dựng tòa nhà 20 tầng tại quận 1, TP.HCM',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      budget: 50000000000, // 50 tỷ VND
      status: ProjectStatus.IN_PROGRESS
    }
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Dự án Khu dân cư XYZ',
      description: 'Xây dựng khu dân cư 100 căn tại Bình Dương',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2025-03-01'),
      budget: 30000000000, // 30 tỷ VND
      status: ProjectStatus.PLANNING
    }
  });

  // Create sample work items
  const workItem1 = await prisma.workItem.create({
    data: {
      projectId: project1.id,
      name: 'Đào móng',
      description: 'Đào móng sâu 5m cho tòa nhà',
      unit: 'm³',
      designQuantity: 500,
      completedQuantity: 150,
      unitPrice: 200000,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-02-15'),
      status: WorkItemStatus.IN_PROGRESS
    }
  });

  const workItem2 = await prisma.workItem.create({
    data: {
      projectId: project1.id,
      name: 'Đổ bê tông móng',
      description: 'Đổ bê tông cốt thép cho móng',
      unit: 'm³',
      designQuantity: 300,
      completedQuantity: 0,
      unitPrice: 2500000,
      startDate: new Date('2024-02-16'),
      endDate: new Date('2024-03-30'),
      status: WorkItemStatus.NOT_STARTED
    }
  });

  // Create sample materials
  const cement = await prisma.material.create({
    data: {
      name: 'Xi măng PC40',
      category: 'xi_mang',
      unit: 'tấn',
      unitPrice: 3500000,
      stockQuantity: 50,
      minimumStock: 10,
      supplier: 'Công ty Xi măng Hà Tiên'
    }
  });

  const sand = await prisma.material.create({
    data: {
      name: 'Cát xây',
      category: 'cat',
      unit: 'm³',
      unitPrice: 450000,
      stockQuantity: 200,
      minimumStock: 20,
      supplier: 'Công ty Vật liệu xây dựng ABC'
    }
  });

  // Create sample equipment
  const excavator = await prisma.equipment.create({
    data: {
      name: 'Máy xúc Komatsu PC200',
      type: 'may_xuc',
      model: 'PC200-8',
      status: EquipmentStatus.IN_USE,
      dailyRate: 2500000,
      lastMaintenance: new Date('2024-01-01'),
      nextMaintenance: new Date('2024-04-01')
    }
  });

  const crane = await prisma.equipment.create({
    data: {
      name: 'Cần cẩu tháp QTZ63',
      type: 'can_cau',
      model: 'QTZ63',
      status: EquipmentStatus.AVAILABLE,
      dailyRate: 3000000,
      lastMaintenance: new Date('2023-12-15'),
      nextMaintenance: new Date('2024-03-15')
    }
  });

  // Create sample workers
  const worker1 = await prisma.worker.create({
    data: {
      employeeCode: 'NV001',
      name: 'Nguyễn Văn An',
      position: 'tho_chinh',
      skillLevel: 4,
      hourlyRate: 50000,
      dailyRate: 400000,
      phone: '0901234567',
      address: 'Quận Tân Bình, TP.HCM',
      hireDate: new Date('2023-01-15'),
      status: WorkerStatus.ACTIVE
    }
  });

  const worker2 = await prisma.worker.create({
    data: {
      employeeCode: 'NV002',
      name: 'Trần Thị Bình',
      position: 'ky_su',
      skillLevel: 5,
      hourlyRate: 80000,
      dailyRate: 640000,
      phone: '0907654321',
      address: 'Quận 1, TP.HCM',
      hireDate: new Date('2022-06-01'),
      status: WorkerStatus.ACTIVE
    }
  });

  // Create work assignments
  await prisma.workAssignment.create({
    data: {
      workItemId: workItem1.id,
      workerId: worker1.id,
      assignedDate: new Date('2024-01-01'),
      estimatedHours: 40,
      role: 'lead'
    }
  });

  await prisma.workAssignment.create({
    data: {
      workItemId: workItem1.id,
      workerId: worker2.id,
      assignedDate: new Date('2024-01-01'),
      estimatedHours: 20,
      role: 'supervisor'
    }
  });

  // Create sample attendance records
  await prisma.attendance.create({
    data: {
      workerId: worker1.id,
      workItemId: workItem1.id,
      date: new Date('2024-01-02'),
      timeIn: '07:00',
      timeOut: '16:00',
      hoursWorked: 8,
      overtimeHours: 0,
      notes: 'Làm việc bình thường'
    }
  });

  // Create material usage
  await prisma.materialUsage.create({
    data: {
      workItemId: workItem1.id,
      materialId: cement.id,
      quantityUsed: 5,
      dateUsed: new Date('2024-01-02'),
      unitCost: 3500000,
      notes: 'Sử dụng cho đổ bê tông móng'
    }
  });

  // Create equipment usage
  await prisma.equipmentUsage.create({
    data: {
      workItemId: workItem1.id,
      equipmentId: excavator.id,
      dateUsed: new Date('2024-01-02'),
      hoursUsed: 8,
      operatorId: worker1.id,
      cost: 2500000,
      notes: 'Đào móng khu vực A'
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created:
  - ${await prisma.project.count()} projects
  - ${await prisma.workItem.count()} work items
  - ${await prisma.material.count()} materials
  - ${await prisma.equipment.count()} equipment
  - ${await prisma.worker.count()} workers
  - ${await prisma.workAssignment.count()} work assignments
  - ${await prisma.attendance.count()} attendance records
  - ${await prisma.materialUsage.count()} material usage records
  - ${await prisma.equipmentUsage.count()} equipment usage records`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });