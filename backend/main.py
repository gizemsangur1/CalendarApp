from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas, crud
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt, JWTError
from auth import SECRET_KEY, ALGORITHM
import crud
from schemas import UserCreate, Token
from typing import List
from auth import create_access_token
from auth import verify_password



models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email zaten kayıtlı")

    user = crud.create_user(db, user.email, user.password)
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Geçersiz giriş bilgileri")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token geçersiz")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token doğrulanamadı")

    user = crud.get_user_by_email(db, email)
    if user is None:
        raise HTTPException(status_code=401, detail="Kullanıcı bulunamadı")
    return user

@app.get("/")
def read_root():
    return {"message": "Takvim API çalışıyor"}

@app.post("/tasks/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_task(db, task, current_user.id)

@app.get("/tasks/", response_model=List[schemas.Task])
def get_tasks(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_tasks_for_user(db, current_user.id)

@app.get("/tasks/{task_id}", response_model=schemas.Task)
def get_task(task_id: int, db: Session = Depends(get_db)):
    db_task = crud.get_task(db, task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Görev bulunamadı")
    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = crud.delete_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Silinecek görev bulunamadı")
    return {"message": "Görev silindi"}

@app.put("/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, updated_data: schemas.TaskCreate, db: Session = Depends(get_db)):
    task = crud.update_task(db, task_id, updated_data)
    if not task:
        raise HTTPException(status_code=404, detail="Güncellenecek görev bulunamadı")
    return task



