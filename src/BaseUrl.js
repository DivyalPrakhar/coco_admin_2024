const localBaseUrl = "http://localhost:4002/";
// const localBaseUrl = "http://192.168.1.40:4001/";
// const testBaseUrl = "https://api.coco.coachinglog.in/";
const testBaseUrl = "http://192.168.1.72:4000/";
const cocotestBaseUrl = "https://api.stage.competitioncommunity.com/";
const liveBaseUrl = "https://api.competitioncommunity.com/";

export function getBaseUrl(host) {
	if (host === "localhost") {
		return {
			base: localBaseUrl,
			students: "https://public.coco.coachinglog.in/",
		};
	} else if (host === "admin.coco.coachinglog.in") {
		return {
			base: testBaseUrl,
			students: "https://public.coco.coachinglog.in/",
		};
	} else if (host === "admin.stage.competitioncommunity.com") {
		return {
			base: cocotestBaseUrl,
			students: "http://students.stage.competitioncommunity.com/",
		};
	} else if (host === "admin.competitioncommunity.com") {
		return {
			base: liveBaseUrl,
			students: "https://student.competitioncommunity.com/",
		};
	}
}

const isclient = typeof window !== "undefined";
if (isclient) {
	console.log("[loc]", window.location);
}

const hostname = window.location?.hostname;
const bburls = getBaseUrl(hostname);
// export const BaseURL = localBaseUrl;
export const BaseURL = "https://api.stage.competitioncommunity.com/";
export const StudentPortalURL =
	hostname === "localhost"
		? "http://localhost:3000"
		: "https://student.competitioncommunity.com";

//used for test
export const BaseURL_WEB = isclient && bburls?.students;
