import { cp } from "fs";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const database = client.db();
  const collection = database.collection("todos");
  try {
    const todos = await collection.find({}).toArray();
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const client = await clientPromise;
  const database = client.db();
  const collection = database.collection("todos");

  const { text } = await req.json();
  try {
    const todo = { text, completed: false };
    await collection.insertOne(todo);
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const { id, completed } = await req.json();

  const client = await clientPromise;
  const database = client.db();
  const collection = database.collection("todos");

  try {
    const updatedTodo = await collection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: { completed },
      }
    );
    return NextResponse.json(updatedTodo, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const client = await clientPromise;
  const database = client.db();
  const collection = database.collection("todos");

  try {
    const deletedTodo = await collection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json(deletedTodo, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
