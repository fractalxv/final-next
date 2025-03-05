import { products } from "../../../data/products";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const id = (await params).id;
  const product = products.find((product) => product.id == id);
  return Response.json(product, { status: 200 });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  const data = await req.json();
  // todo: update data based on id with data
  return Response.json(
    { message: `Data with id ${id} has been updated`, product: data },
    { status: 200 }
  );
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  // todo: delete data based on id
  return Response.json(
    { message: `Data with id ${id} has been deleted` },
    { status: 200 }
  );
}