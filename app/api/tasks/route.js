import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import Employee from "@/models/Employee";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// FILE SETTINGS
// ==========================================

const MAX_FILES = 5;

const MAX_FILE_SIZE =
  10 * 1024 * 1024; // 10 MB

const ALLOWED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
];

// ==========================================
// UPLOAD FILE TO CLOUDINARY
// ==========================================

const uploadToCloudinary = async (
  file
) => {
  const arrayBuffer =
    await file.arrayBuffer();

  const buffer =
    Buffer.from(arrayBuffer);

  return new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",

            folder:
              "hr_tasks",

            use_filename: true,

            unique_filename: true,

            overwrite: false,
          },

          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

      uploadStream.end(buffer);
    }
  );
};


// ==========================================
// DELETE CLOUDINARY FILE
// ==========================================

const deleteCloudinaryFile =
  async (
    publicId,
    resourceType
  ) => {
    if (!publicId) {
      return;
    }

    try {
      await cloudinary.uploader.destroy(
        publicId,
        {
          resource_type:
            resourceType ||
            "image",

          invalidate: true,
        }
      );
    } catch (error) {
      console.error(
        "Cloudinary delete error:",
        error
      );
    }
  };

// ==========================================
// GET TASKS
// ==========================================

export async function GET(
  request
) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const employeeId =
      searchParams.get(
        "employeeId"
      );

    const assignedByEmployeeId =
      searchParams.get(
        "assignedByEmployeeId"
      );

    const status =
      searchParams.get(
        "status"
      );

    const filter = {};

    if (employeeId) {
      filter.employeeId =
        employeeId;
    }

    if (
      assignedByEmployeeId
    ) {
      filter.assignedByEmployeeId =
        assignedByEmployeeId;
    }

    if (status) {
      filter.status = status;
    }

    const tasks =
      await Task.find(filter)
        .populate(
          "employeeId",
          "employeeFullName employeeCode designation employeePhoto"
        )
        .populate(
          "assignedByEmployeeId",
          "employeeFullName employeeCode designation employeePhoto"
        )
        .sort({
          createdAt: -1,
        });

    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error(
      "GET tasks error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load tasks.",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// CREATE TASK
// ==========================================

export async function POST(
  request
) {
  const uploadedFiles = [];

  try {
    await connectDB();

    const contentType =
      request.headers.get(
        "content-type"
      ) || "";

    let employeeId = "";
    let assignedByEmployeeId =
      "";
    let title = "";
    let description = "";
    let taskDate = "";
    let dueDate = "";
    let priority = "Medium";
    let files = [];

    // ======================================
    // FORM DATA
    // ======================================

    if (
      contentType.includes(
        "multipart/form-data"
      )
    ) {
      const formData =
        await request.formData();

      employeeId =
        formData.get(
          "employeeId"
        ) || "";

      assignedByEmployeeId =
        formData.get(
          "assignedByEmployeeId"
        ) || "";

      title =
        formData.get("title") ||
        "";

      description =
        formData.get(
          "description"
        ) || "";

      taskDate =
        formData.get(
          "taskDate"
        ) || "";

      dueDate =
        formData.get(
          "dueDate"
        ) || "";

      priority =
        formData.get(
          "priority"
        ) || "Medium";

      files = formData
        .getAll("files")
        .filter(
          (file) =>
            file &&
            typeof file.arrayBuffer ===
              "function"
        );
    } else {
      // ====================================
      // JSON SUPPORT
      // ====================================

      const body =
        await request.json();

      employeeId =
        body.employeeId ||
        "";

      assignedByEmployeeId =
        body.assignedByEmployeeId ||
        "";

      title =
        body.title || "";

      description =
        body.description ||
        "";

      taskDate =
        body.taskDate || "";

      dueDate =
        body.dueDate || "";

      priority =
        body.priority ||
        "Medium";

      files = [];
    }

    // ======================================
    // VALIDATION
    // ======================================

    if (!employeeId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Employee is required.",
        },
        { status: 400 }
      );
    }

    if (
      !title ||
      !title.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Task title is required.",
        },
        { status: 400 }
      );
    }

    if (!taskDate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Task date is required.",
        },
        { status: 400 }
      );
    }


    

    if (
      files.length >
      MAX_FILES
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `Maximum ${MAX_FILES} files can be attached.`,
        },
        { status: 400 }
      );
    }

    // ======================================
    // CHECK ASSIGNED EMPLOYEE
    // ======================================

    const employee =
      await Employee.findById(
        employeeId
      );

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Assigned employee not found.",
        },
        { status: 404 }
      );
    }

    // ======================================
    // CHECK ASSIGNING EMPLOYEE
    // ======================================

    if (
      assignedByEmployeeId
    ) {
      const assigningEmployee =
        await Employee.findById(
          assignedByEmployeeId
        );

      if (!assigningEmployee) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Assigning employee not found.",
          },
          { status: 404 }
        );
      }
    }

    // ======================================
    // UPLOAD FILES
    // ======================================

    for (const file of files) {
      const fileName =
        file.name || "";

      const extension =
        fileName
          .split(".")
          .pop()
          ?.toLowerCase();

      // Check extension
      if (
        !extension ||
        !ALLOWED_EXTENSIONS.includes(
          extension
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `File type .${
              extension || ""
            } is not allowed.`,
          },
          { status: 400 }
        );
      }

      // Check size
      if (
        file.size >
        MAX_FILE_SIZE
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `${fileName} is larger than 10 MB.`,
          },
          { status: 400 }
        );
      }

      const result =
        await uploadToCloudinary(
          file
        );

      uploadedFiles.push({
        fileName,

        url:
          result.secure_url,

        publicId:
          result.public_id ||
          "",

        resourceType:
          result.resource_type ||
          "",

        format:
          result.format ||
          extension,

        mimeType:
          file.type || "",

        size:
          file.size || 0,
      });
    }

    // ======================================
    // CREATE TASK
    // ======================================

    const task =
      await Task.create({
        employeeId,

        assignedByEmployeeId:
          assignedByEmployeeId ||
          null,

        title:
          title.trim(),

        description:
          description
            ? description.trim()
            : "",

        taskDate:
          new Date(taskDate),

        dueDate:
          dueDate
            ? new Date(dueDate)
            : null,

        priority,

        status: "Pending",

        attachments:
          uploadedFiles,
      });

    // ======================================
    // POPULATE TASK
    // ======================================

    const populatedTask =
      await Task.findById(
        task._id
      )
        .populate(
          "employeeId",
          "employeeFullName employeeCode designation employeePhoto"
        )
        .populate(
          "assignedByEmployeeId",
          "employeeFullName employeeCode designation employeePhoto"
        );

    return NextResponse.json(
      {
        success: true,
        message:
          "Task assigned successfully.",
        task: populatedTask,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST tasks error:",
      error
    );

// task to add
// invoice
// harshproducts
// hrtask


    // ======================================
    // CLEANUP CLOUDINARY FILES
    // IF TASK CREATION FAILS
    // ======================================

    if (
      uploadedFiles.length >
      0
    ) {
      await Promise.all(
        uploadedFiles.map(
          (file) =>
            deleteCloudinaryFile(
              file.publicId,
              file.resourceType
            )
        )
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to create task.",
      },
      {
        status: 500,
      }
    );
  }
}