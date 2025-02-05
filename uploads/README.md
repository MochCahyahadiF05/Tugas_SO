# Hello World

## Nama : Mochammad Cahyahadi Fadhlurrahman
## Kelas: TIF RP 23D
## NIM  :23552011347

## VaultSync - File Rename Feature

### Fitur Baru
1. **Rename File**:
   - Endpoint: `POST /rename`
   - **Deskripsi**: Mengganti nama file yang diunggah.
   - **Parameter**:
     - `oldName`: Nama file lama (string).
     - `newName`: Nama file baru (string).
   - **Respons**:
     - `200`: Berhasil mengganti nama file.
     - `404`: File tidak ditemukan.
     - `500`: Gagal mengganti nama file.
