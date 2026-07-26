import os

base_pkg = "package com.promobridge.api.repository;\n\n"
imports = """import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;
"""

entities = [
    "BusinessProfile",
    "CreatorProfile",
    "Campaign",
    "CampaignApplication",
    "Conversation",
    "Message",
    "Review",
    "Notification"
]

def generate():
    path = "src/main/java/com/promobridge/api/repository"
    os.makedirs(path, exist_ok=True)
    
    for entity in entities:
        content = base_pkg + imports + f"import com.promobridge.api.entity.{entity};\n\n"
        content += f"@Repository\npublic interface {entity}Repository extends JpaRepository<{entity}, UUID> {{\n}}\n"
        
        with open(f"{path}/{entity}Repository.java", "w") as f:
            f.write(content)

if __name__ == "__main__":
    generate()
    print("Repositories generated successfully.")
