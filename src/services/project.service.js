import Project from "@/models/project";
import dbConnect from "@/app/lib/dbConnect";
import Application from "@/models/application";
import { auth } from "../../auth";


/**
* @param {Object} projectData 
* @param {String} projectData.name
* @param {String} projectData.description
* */
async function createProject(projectData) {
    await dbConnect();
    const project = await Project.create({ ...projectData });
    return project;
}

async function getAllProjects() {
    await dbConnect();
    const projects = await Project.find();
    return projects;
}

async function getProjectsCount() {
    await dbConnect();
    const count = Project.countDocuments({});
    return count;
}

async function getProjectById(id) {
    await dbConnect();
    const project = await Project.findById(id);
    return project;
}

async function applyToProject(projectId, applicationData) {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("User must be logged in to apply!");
    }
    await dbConnect();

    const { motivationalLetter, position } = applicationData;

    const newApplication = await Application.create({
        memberId: session.user.id,
        projectId,
        motivationalLetter,
        position
    });

    await Project.findByIdAndUpdate(
        projectId,
        { $push: { applications: newApplication.id } },
        { new: true }
    );
}

async function getApplicationsForProject(projectId) {
    await dbConnect();
    const applications = Application.find({ projectId });
    return applications;
}

export {
    getAllProjects,
    getProjectById,
    getApplicationsForProject,
    createProject,
    applyToProject,
    getProjectsCount
}
