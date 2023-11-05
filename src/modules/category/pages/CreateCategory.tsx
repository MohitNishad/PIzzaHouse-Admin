import {
    Button,
    Card,
    CardBody,
    Input,
    CardHeader,
    Spinner,
} from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@/hooks/state";
import RenderAttribute from "../components/RenderAttribute";
import ImageUploader from "@/components/ImageUploader";
import CategoryAttribute from "../components/CategoryAttribute";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useState } from "react";
import { ProcessedImageType } from "@/schema/ImageUploader";
import { Navigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
    mutatePriceAttr,
    setUpdatedFields,
} from "@/store/features/categorySlice";
import { Attribute } from "@/schema/categorySlice";
import useCategoryAttributes from "../hooks/useCategoryAttributes";
import { useEffect } from "react";
import { useSocketContext } from "@/socketContext";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
// import CategoryContextProvider from "../context";

function CreateCategory() {
    const socket = useSocketContext()
    // socket.on('uploading_image',() => {

    // })
    const { type } = useParams();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const category = useAppSelector(
        (state) => state.category.currentSelectedCategory
    );
    if (!category && type === "update") {
        return <Navigate to="/category" />;
    }
// fetching attributes if they are not in state
    const [id, setId] = useState("");
    const { data, isLoading } = useCategoryAttributes(id);
    const categoryAtt = queryClient.getQueryState<Attribute[]>([
        "category",
        "attribute",
        category && category.id,
    ]);
// for udpating the cateogry 
const {mutate:updateCategory,isPending:UpdatePending} = useUpdateCategory()

    const { categoryArray, updatedFields } = useAppSelector(
        (state) => state.category
    );
    const [name, setName] = useState(category?.name || "");
    const { mutate, isPending } = useCreateCategory();
    const [processedImage, setProcessedImage] = useState<ProcessedImageType>({
        url: "",
        file: "",
    });

    function handleCreate() {
        const form = new FormData();
        form.append("image", processedImage.file as Blob);
        form.append("name", name);
        form.append("json", JSON.stringify(categoryArray));
        mutate(form);
    }
    function handleUpdate(){
        const form = new FormData()
        if(category){
            form.append("id",category.id)
            form.append("is_name_update",`${updatedFields.name}`)
            form.append("is_image_update",`${updatedFields.image}`)
            form.append("is_price_attributes_update",`${updatedFields.price_attributes}`)
            form.append("name",name)
            form.append("image",processedImage.file as Blob)
            form.append('json',JSON.stringify(categoryArray))
            updateCategory(form)
        }
    }

    useEffect(() => {
        if (type === "update" && categoryAtt?.data) {
            dispatch(mutatePriceAttr(categoryAtt?.data));
        } else if (type === "update") {
            setId(category?.id || "");
        }
    }, []);

    useEffect(() => {
        if (data) {
            dispatch(mutatePriceAttr(data));
        }
    }, [data]);

    return (
        <Card
            classNames={{
                body: "flex flex-col gap-3 lg:flex-row lg:justify-between xl:justify-normal xl:gap-[250px]",
            }}
            className={`min-h-[200px] ${
                isLoading && "flex items-center justify-center"
            }`}
        >
            {isLoading ? (
                <Spinner size="lg" />
            ) : (
                <>
                    <CardHeader className="pb-0 text-primaryOrange">
                        Create Category
                    </CardHeader>
                    <CardBody>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <ImageUploader
                                    defaultImage={category?.image}
                                    type="category"
                                    processedImage={processedImage}
                                    setProcessedImage={setProcessedImage}
                                />
                                <Input
                                    size="lg"
                                    radius="sm"
                                    placeholder="Category name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (!updatedFields.name) {
                                            dispatch(setUpdatedFields("name"));
                                        }
                                    }}
                                    classNames={{
                                        base: "w-[200px]",
                                    }}
                                />
                            </div>
                            <CategoryAttribute />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                {categoryArray.map(
                                    ({ attribute_title, id, attributes }) => (
                                        <RenderAttribute
                                            attribute_title={attribute_title}
                                            key={id}
                                            id={id}
                                            attributes={attributes}
                                        />
                                    )
                                )}
                            </div>
                            <Button
                                onPress={ type == 'create' ? handleCreate : handleUpdate }
                                className="w-[100px] bg-primaryOrange text-white self-end mt-auto"
                                isLoading={isPending || UpdatePending}
                            >
                                Submit
                            </Button>
                        </div>
                    </CardBody>
                </>
            )}
        </Card>
    );
}
export default CreateCategory;
