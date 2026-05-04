"use client";

import { useState } from "react";
import Image from "next/image";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { Loader2, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
export default function ImageDetectionPage() {
	const [selectedImage, setSelectedImage] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const [result, setResult] = useState(null);
	const isRust = result?.prediction === "rust";

	const handleImageChange = (event) => {
		setResult(null);
		const file = event.target.files?.[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				toast({
					title: "Warning",
					discrebtion: "Provide an image ...",
				});
				return;
			}
			setSelectedImage(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const handleDetectClick = async () => {
		setIsLoading(true);
		const formData = new FormData();
		formData.append("image", selectedImage);
		try {
			const response = await fetch(
				process.env.API_URL,
				{
					method: "Post",
					body: formData,
				}
			);

			const data = await response.json();
			if (data.error) {
				toast({
					title: "Error",
					discrebtion: "Provide an image ...",
				});
				return;
			}
			setResult(data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-12">
			<h1 className="text-4xl font-bold text-center mb-8">
				Image Corrosion Detection
			</h1>
			<p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
				Upload an image to analyze it for corrosion using simulated MobileNetV3
				and YOLOv9 models, followed by an AI-generated explanation of the
				potential impact.
			</p>

			<Card className="max-w-2xl mx-auto mb-8 shadow-md">
				<CardHeader>
					<CardTitle>Upload Image</CardTitle>
					<CardDescription>
						Select an image file (PNG, JPG, etc.) up to 5MB.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex flex-col items-center space-y-4">
						<label
							htmlFor="image-upload"
							className="cursor-pointer w-full border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center hover:border-primary transition-colors duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
						>
							<UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
							<span className="block font-medium text-foreground">
								{selectedImage
									? `Selected: ${selectedImage.name}`
									: "Click to file to upload"}
							</span>
							<span className="block text-sm text-muted-foreground mt-1">
								Max file size: 5MB
							</span>
							<Input
								id="image-upload"
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="hidden" // Visually hide, label handles interaction
								aria-label="Upload image file"
							/>
						</label>

						{previewUrl && (
							<div className="w-full max-w-xs h-48 relative rounded-md overflow-hidden border shadow-sm bg-muted/30">
								<Image
									src={previewUrl}
									alt="Selected image preview"
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									style={{ objectFit: "contain" }} // Use style for objectFit
								/>
							</div>
						)}
					</div>

					<Button
						onClick={handleDetectClick}
						className="w-full text-lg capitalize"
						disabled={isLoading ? true : previewUrl == null}
						size="lg"
						aria-live="polite"
					>
						{isLoading ? (
							<span className="flex gap-3 items-center">
								<Loader2 className=" animate-spin" />
								predicting...
							</span>
						) : (
							"Predict"
						)}
					</Button>
				</CardContent>
			</Card>
			{Result && (
				<Card className="max-w-2xl mx-auto mb-8 shadow-md">
					<CardHeader>
						<CardTitle>Result</CardTitle>
					</CardHeader>
					<CardContent>
						<div className=" flex flex-col gap-3">
							<div
								className={`flex justify-between rounded items-center px-2 ${
									isRust
										? "text-orange-900 bg-orange-200"
										: "text-green-900 bg-green-100"
								}  `}
							>
								<p
									className={`capitalize py-3  rounded text-xl font-bold  flex-1  `}
								>
									{result.prediction}
								</p>

								<Badge
									className={`py-1 px-3 rounded-full font-bold text-sm text-white ${
										isRust ? "bg-orange-950   " : "bg-green-900 "
									} hover:${isRust ? "bg-orange-950   " : "bg-green-900 "}`}
								>
									{result.probability + " %"}
								</Badge>
							</div>
							<div className=" w-full h-96 relative rounded-md overflow-hidden border shadow-sm bg-muted/30">
								<Image
									src={result.uri ? Result.uri : previewUrl}
									alt="Result of prediction"
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									style={{ objectFit: "contain" }} // Use style for objectFit
								/>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
