from sqlalchemy.orm import Session
from models import Task
from schemas import TaskCreate
from datetime import datetime

def create_task(db: Session, task: TaskCreate, user_id: int = None):
    db_task = Task(
        title=task.title,
        description=task.description,
        start_time=task.start_time,
        end_time=task.end_time,
        completed=False,
        created_at=datetime.utcnow(),
        user_id=user_id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_tasks(db: Session):
    return db.query(Task).all()

def get_task(db: Session, task_id: int):
    return db.query(Task).filter(Task.id == task_id).first()

def delete_task(db: Session, task_id: int):
    task = db.query(Task).filter(Task.id == task_id).first()
    if task:
        db.delete(task)
        db.commit()
    return task

def update_task(db: Session, task_id: int, updated_data: TaskCreate):
    task = db.query(Task).filter(Task.id == task_id).first()
    if task:
        task.title = updated_data.title
        task.description = updated_data.description
        task.start_time = updated_data.start_time
        task.end_time = updated_data.end_time
        task.completed = updated_data.completed
        db.commit()
        db.refresh(task)
    return task

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, email: str, password: str):
    hashed_password = get_password_hash(password)
    user = User(email=email, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user