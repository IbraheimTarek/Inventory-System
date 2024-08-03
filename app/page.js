"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore, storage } from "@/firebse";
import {
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";

//import styles from "./page.module.css";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [file, setFile] = useState("");

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `images/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  };
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };
  const addItem = async (item, file) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docsnap = await getDoc(docRef);
    let imageUrl = "";

    if (file) {
      imageUrl = await uploadImage(file);
    }

    if (docsnap.exists()) {
      const { count, imageUrl } = docsnap.data();
      await setDoc(docRef, { count: count + 1, imageUrl: imageUrl });
    } else {
      await setDoc(docRef, { count: 1, imageUrl });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docsnap = await getDoc(docRef);
    if (docsnap.exists()) {
      const { count, imageUrl } = docsnap.data();
      if (count === 1) {
        // Delete the image from Firebase Storage
        if (imageUrl) {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        }
        // Delete the document from Firestore
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 }, { merge: true });
      }
    }
    await updateInventory();
  };

  const filteredInventory = inventory.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    updateInventory();
  }, []);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width="400"
          bgcolor="white"
          border="2px solid black"
          boxShadow="24"
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h6">add item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            ></TextField>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <Button
              onClick={() => {
                addItem(itemName.toLowerCase(), file);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box>
        <Typography variant="h2">Inventory Managment System</Typography>
      </Box>
      <Stack
        direction="row"
        spacing={2}
        width="70%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <TextField
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search items..."
        />
        <Box>
          <Button
            variant="contained"
            onClick={() => {
              handleOpen();
            }}
          >
            +
          </Button>
        </Box>
      </Stack>
      <Box border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADDE"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
      </Box>
      <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {filteredInventory.map(({ name, count, imageUrl }) => (
          <Box
            key={name}
            width="100%"
            height="100%"
            bgcolor="#f0f0f0"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding={5}
          >
            <Typography variant="h3" textAlign="center">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            {imageUrl && (
              <Image src={imageUrl} alt={name} width={50} height={50} />
            )}
            <Typography variant="h3" textAlign="center">
              {count}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={() => addItem(name)}>
                Add
              </Button>
              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
