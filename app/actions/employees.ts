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
  try {
    const employee = await prisma.employee.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        position: data.position,
        phone: data.phone || null,
        hireDate: new Date(data.hireDate),
      },
    })

    revalidatePath("/admin/employees")
    return { success: true, employee }
  } catch (error: any) {
    console.error("[v0] createEmployee error:", error)
    return { success: false, error: "Hodim qo'shishda xatolik yuz berdi" }
  }
}

export async function updateEmployee(id: string, data: EmployeeData) {
  try {
    await prisma.employee.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        position: data.position,
        phone: data.phone || null,
        hireDate: new Date(data.hireDate),
      },
    })

    revalidatePath("/admin/employees")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] updateEmployee error:", error)
    return { success: false, error: "Hodimni yangilashda xatolik yuz berdi" }
  }
}

export async function deleteEmployee(id: string) {
  try {
    await prisma.employee.delete({
      where: { id },
    })

    revalidatePath("/admin/employees")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] deleteEmployee error:", error)
    return { success: false, error: "Hodimni o'chirishda xatolik yuz berdi" }
  }
}

export async function getEmployees() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { firstName: "asc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        position: true,
      },
    })
    return { success: true, employees }
  } catch (error: any) {
    console.error("[v0] getEmployees error:", error)
    return { success: false, employees: [], error: "Hodimlarni yuklashda xatolik" }
  }
}
