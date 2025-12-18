"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type EmployeeData = {
  firstName: string
  lastName: string
  position: string
  phone: string
  hireDate: Date
}

export async function createEmployee(data: EmployeeData) {
  await prisma.employee.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      position: data.position,
      phone: data.phone || null,
      hireDate: data.hireDate,
    },
  })

  revalidatePath("/admin/employees")
}

export async function updateEmployee(id: string, data: EmployeeData) {
  await prisma.employee.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      position: data.position,
      phone: data.phone || null,
      hireDate: data.hireDate,
    },
  })

  revalidatePath("/admin/employees")
}

export async function deleteEmployee(id: string) {
  await prisma.employee.delete({
    where: { id },
  })

  revalidatePath("/admin/employees")
}
