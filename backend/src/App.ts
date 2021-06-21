import express, { RequestHandler } from "express";
import admin from "firebase-admin";
import key from "./service-key.json";
import jwt from "jsonwebtoken";
import morgan from "morgan";
import Multer from "multer";
import cors from "cors";
const upload = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
});

const app = express();

admin.initializeApp({
    credential: admin.credential.cert(key as any),
});
app.use(cors({ origin: "*" }));
const JWT_SECRET = "verysecure_secret";

const checkAuthMiddleware = (): RequestHandler => async (req, res, next) => {
    const header = req.headers["authorization"];

    if (header) {
        const [, token] = header.split("Bearer ");

        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);

            //@ts-ignore
            if (decoded.admin) {
                const firestore = admin.firestore();
                const result = await firestore
                    .collection("users")
                    //@ts-ignore
                    .where("username", "==", decoded.username)
                    .get();
                if (result.docs[0].data().isLoggedIn) {
                    return next();
                } else {
                    return res.status(403).send({ msg: "LoggedOut" });
                }
            }
        }
    }
    res.status(401).send({ msg: "UnAuthorized" });
};

const uploadFileToFirebase = (file: Express.Multer.File) => {
    return new Promise<string>((res: any, rej) => {
        const fireStorage = admin.storage();
        const bucket = fireStorage.bucket("college-proj-lamton.appspot.com");
        const path = `uploads/${file.originalname}`;
        const fFile = bucket.file(path);

        const blobWriter = fFile.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        blobWriter.on("error", (err) => {
            rej(err);
        });

        blobWriter.on("finish", async () => {
            const url = await fFile.getSignedUrl({
                expires: new Date("2030-1-11"),
                action: "read",
            });

            res({ url: url[0], path });
        });

        blobWriter.end(file.buffer);
    });
};
const deleteImage = async (path: string) => {
    const fireStorage = admin.storage();
    const bucket = fireStorage.bucket("college-proj-lamton.appspot.com");
    await bucket.file(path).delete();
};

app.use(morgan("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const firestore = admin.firestore();
    const result = await firestore
        .collection("users")
        .where("username", "==", username)
        .where("password", "==", password)
        .get();

    if (result.docs.length > 0) {
        const token = jwt.sign({ admin: true, username: username }, JWT_SECRET);
        await result.docs[0].ref.update({ isLoggedIn: true });
        res.send({ token });
    } else {
        res.status(401).send({ msg: "User Not Found" });
    }
});

app.get("/designs", async (req, res) => {
    const firestore = admin.firestore();
    const result = await firestore.collection("designs").get();
    const designs = result.docs.map((item) => {
        return { ...item.data(), id: item.id };
    });

    res.send(designs);
});

app.get("/bookings", checkAuthMiddleware(), async (req, res) => {
    const firestore = admin.firestore();
    const result = await firestore.collection("bookings").get();
    const designs = result.docs.map((item) => ({...item.data() , id: item.id}));

    res.send(designs);
});
app.delete("/bookings/:id", checkAuthMiddleware(), async (req, res) => {
    const { id } = req.params;

    const firestore = admin.firestore();
    const result = await firestore.collection("bookings").doc(id).get();

    if (!result.exists) {
        return res.send({ msg: "Design Not Found" });
    }
    await result.ref.delete();

    return res.send(result);

});

app.post("/bookings", async (req, res) => {
    const { name, venue, date, contact, email, designId } = req.body;
    const firestore = admin.firestore();
    const result = await firestore
        .collection("bookings")
        .add({ name, venue, contact, email, date, designId });

    return res.send((await result.get()).data());
});

app.post(
    "/designs",
    checkAuthMiddleware(),
    upload.array("images"),
    async (req, res) => {
        const files = req.files as any[];
        const { name, price } = req.body;
        if (!files || files.length === 0) {
            return res.send({ msg: "No Images Were Added" });
        }
        let images = [];
        for (const file of files) {
            images.push(await uploadFileToFirebase(file));
        }
        const firestore = admin.firestore();
        const result = await firestore
            .collection("designs")
            .add({ name, price, images });

        return res.send((await result.get()).data());
    }
);

app.delete("/designs/:id", checkAuthMiddleware(), async (req, res) => {
    const { id } = req.params;

    const firestore = admin.firestore();
    const result = await firestore.collection("designs").doc(id).get();

    if (!result.exists) {
        return res.send({ msg: "Design Not Found" });
    }
    await result.ref.delete();

    return res.send(result);
});

app.put("/designs", checkAuthMiddleware(), async (req, res) => {
    const { id, name, price } = req.body;

    const firestore = admin.firestore();
    const result = await firestore
        .collection("designs")
        .where("id", "==", id)
        .get();
    if (result.docs.length === 0) {
        return res.send({ msg: "Design Not Found" });
    }
    await result.docs[0].ref.update({
        name,
        price,
    });

    return res.send(result);
});

// Add New Images
app.post(
    "/designs/:id/images",
    checkAuthMiddleware(),
    upload.array("images"),
    async (req, res) => {
        const { id } = req.params;
        const firestore = admin.firestore();
        const result = await firestore
            .collection("designs")
            .where("id", "==", id)
            .get();
        if (result.docs.length === 0) {
            return res.send({ msg: "Design Not Found" });
        }
        const files = req.files as any[];

        if (!files || files.length === 0) {
            return res.send({ msg: "No Images Were Added" });
        }
        let images = result.docs[0].data().images;
        for (const file of files) {
            images.push(await uploadFileToFirebase(file));
        }
        await result.docs[0].ref.update({ images });
        return res.send(result.docs[0].data());
    }
);

app.delete("/designs/:id/images/", checkAuthMiddleware(), async (req, res) => {
    const { id } = req.params;
    const { path } = req.body;
    const firestore = admin.firestore();
    const result = await firestore
        .collection("designs")
        .where("id", "==", id)
        .get();
    if (result.docs.length === 0) {
        return res.send({ msg: "Design Not Found" });
    }

    let images = result.docs[0].data().images;
    const newAimage = images.filter((item: any) => item.path !== path);
    await deleteImage(path);
    await result.docs[0].ref.update({ images: newAimage });
    return res.send(result.docs[0].data());
});

app.get("/kill", () => {
    process.exit(0);
});

app.get("*", (req, res) => {
    res.send("Server is working properly, with continuous deployment");
});

export default app;
