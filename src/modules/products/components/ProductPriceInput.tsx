import useDebounce from "@/hooks/useDebounce";
import {
    setDefaultProductPrices,
    setProductPriceSectionAttribute,
} from "@/store/slices/product";
import { Badge, Button, Input } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useProductContext } from "../context";
import { useAppDispatch, useAppSelector } from "@/hooks/state";

interface Props {
    attribute: {
        id: string;
        title: string;
    };
    section: string;
}

function ProductPriceInput({ attribute, section }: Props) {
    const data = useAppSelector(
        (state) => state.product.product_price_section_attribute[attribute.id]
    );
    const isDefault = useAppSelector(
        (state) => state.product.default_prices[section].id !== attribute.id
    );
    const [inputValue, setInputValue] = useState("");
    const dispatch = useAppDispatch();
    const PageLoaded = useRef<boolean>(false);
    const debounce = useDebounce(inputValue, 350);
    const { InputRef, inputIdArrayRef } = useProductContext();

    useEffect(() => {
        if (debounce != null) {
            dispatch(
                setProductPriceSectionAttribute({
                    type: "UPDATE",
                    data: {
                        [attribute.id]: {
                            ...data,
                            value: debounce,
                        },
                    },
                })
            );
        }
    }, [debounce]);

    useEffect(() => {
        if (data && !PageLoaded.current) {
            setInputValue(data.value);
            PageLoaded.current = true;
        }
    }, [data]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            const index = inputIdArrayRef.current.findIndex(
                (inputId) => inputId == attribute.id
            );
            const inputs = [...inputIdArrayRef.current].slice(
                (index + 1) % inputIdArrayRef.current.length
            );
            const input = InputRef.current[inputs[0]];
            input?.focus();
        }
    }
    return (
        data && (
            <Badge
                content="Default"
                isInvisible={isDefault}
                color="primary"
                className="border-darkOrange mr-3"
                placement="top-right"
            >
                <div className="flex">
                    <Button
                        className={`h-[40px] text-white rounded-none rounded-l-md pl-2 border-2 ${
                            isDefault
                                ? "border-darkOrange bg-primaryOrange"
                                : "border-red-700 bg-red-500"
                        }`}
                        onPress={() =>
                            dispatch(
                                setDefaultProductPrices({
                                    type: "UPDATE",
                                    data: {
                                        id: attribute.id,
                                        attribute_name: attribute.title,
                                        section: section,
                                        value: inputValue,
                                    },
                                })
                            )
                        }
                    >
                        {attribute.title}
                    </Button>
                    <Input
                        type="number"
                        value={inputValue}
                        onChange={(e) => {
                            if (data.error) {
                                dispatch(
                                    setProductPriceSectionAttribute({
                                        type: "UPDATE",
                                        data: {
                                            [attribute.id]: {
                                                ...data,
                                                error: false,
                                            },
                                        },
                                    })
                                );
                            }
                            setInputValue(e.target.value);
                        }}
                        radius="none"
                        classNames={{
                            base: "w-[100px] h-[40px]",
                            inputWrapper: "rounded-r-md h-[40px]",
                        }}
                        isInvalid={data.error}
                        onKeyDown={handleKeyDown}
                        ref={(e) => {
                            inputIdArrayRef.current.push(attribute.id);
                            InputRef.current[attribute.id] = e;
                        }}
                    />
                </div>
            </Badge>
        )
    );
}

export default ProductPriceInput;