import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";

function App() {
    // State tanımlamaları
    const [modalOpen, setModalOpen] = useState(false); // Modalın açık olup olmadığını kontrol eder
    const [name, setName] = useState(""); // Ürün adı için state
    const [price, setPrice] = useState(""); // Ürün fiyatı için state
    const [products, setProducts] = useState([]); // Ürünler listesi için state

    // Ürünleri API'den çeken fonksiyon
    const fetchProducts = async () => {
        try {
            const response = await axios.get("https://s99zc34zr4.execute-api.us-east-1.amazonaws.com/dev/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Hata:", error);
        }
    };

    // Komponent yüklendiğinde ürünleri çek
    useEffect(() => {
        fetchProducts();
    }, []);

    // Modalı açma işlemi
    const handleOpen = () => {
        setModalOpen(true);
    };

    // Modalı kapatma işlemi
    const handleClose = () => {
        setModalOpen(false);
    };

    // Yeni ürün kaydetme işlemi
    const handleSave = async () => {
        try {
            let data = JSON.stringify({
                name: name,
                price: parseInt(price)
            });
            let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: "https://s99zc34zr4.execute-api.us-east-1.amazonaws.com/dev/products",
                headers: {
                    "Content-Type": "application/json"
                },
                data: data
            };

            axios
                .request(config)
                .then((response) => {
                    console.log(response.data);
                    fetchProducts(); // Ürünleri yeniden çek
                    handleClose(); // Modalı kapat
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.error("Hata:", error);
        }
    };

    // Ürün silme işlemi
    const handleDelete = (name, price) => {
        const data = JSON.stringify({
            _id: Math.random(), // Bu kısım gereksiz olabilir, API'nize bağlı
            name: name,
            price: price
        });

        const config = {
            method: "delete",
            maxBodyLength: Infinity,
            url: `https://s99zc34zr4.execute-api.us-east-1.amazonaws.com/dev/products/object/${name}/${price}`,
            headers: {
                "Content-Type": "text/plain"
            },
            data: data
        };

        axios
            .request(config)
            .then((response) => {
                console.log(response.data);
                fetchProducts(); // Ürünleri yeniden çek
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // UI Render
    return (
        <div style={{ margin: "20px" }}>
            {/* Yeni ürün ekleme butonu */}
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Yeni Ekle
            </Button>
            {/* Ürünler tablosu */}
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ad</TableCell>
                            <TableCell align="right">Fiyat</TableCell>
                            <TableCell align="right">İşlem</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {product.name}
                                </TableCell>
                                <TableCell align="right">{product.price}</TableCell>
                                {/* Silme butonu */}
                                <TableCell align="right">
                                    <IconButton onClick={() => handleDelete(product.name, product.price)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* Yeni ürün ekleme formu içeren modal */}
            <Dialog open={modalOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Yeni Ürün Ekle</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" id="name" label="Ürün Adı" type="text" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField margin="dense" id="price" label="Fiyat" type="number" fullWidth value={price} onChange={(e) => setPrice(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        İptal
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Kaydet
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default App;
