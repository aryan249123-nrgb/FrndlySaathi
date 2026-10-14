package com.example.demo.config;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProposalRepository proposalRepository;
    private final ContractRepository contractRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ProjectRepository projectRepository,
                           ProposalRepository proposalRepository,
                           ContractRepository contractRepository,
                           PaymentRepository paymentRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.proposalRepository = proposalRepository;
        this.contractRepository = contractRepository;
        this.paymentRepository = paymentRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Ensure Demo Clients exist
        User client1 = userRepository.findByEmail("priya@client.com").orElseGet(() -> {
            User u = new User();
            u.setName("Priya Sharma");
            u.setEmail("priya@client.com");
            u.setPassword(passwordEncoder.encode("password123"));
            u.setRole(Role.CLIENT);
            return userRepository.save(u);
        });

        User client2 = userRepository.findByEmail("rahul@client.com").orElseGet(() -> {
            User u = new User();
            u.setName("Rahul Verma");
            u.setEmail("rahul@client.com");
            u.setPassword(passwordEncoder.encode("password123"));
            u.setRole(Role.CLIENT);
            return userRepository.save(u);
        });

        // Ensure Demo Freelancers exist
        User free1 = userRepository.findByEmail("aarav@freelancer.com").orElseGet(() -> {
            User u = new User();
            u.setName("Aarav Patel");
            u.setEmail("aarav@freelancer.com");
            u.setPassword(passwordEncoder.encode("password123"));
            u.setRole(Role.FREELANCER);
            return userRepository.save(u);
        });

        User free2 = userRepository.findByEmail("neha@freelancer.com").orElseGet(() -> {
            User u = new User();
            u.setName("Neha Gupta");
            u.setEmail("neha@freelancer.com");
            u.setPassword(passwordEncoder.encode("password123"));
            u.setRole(Role.FREELANCER);
            return userRepository.save(u);
        });

        User free3 = userRepository.findByEmail("vikram@freelancer.com").orElseGet(() -> {
            User u = new User();
            u.setName("Vikram Malhotra");
            u.setEmail("vikram@freelancer.com");
            u.setPassword(passwordEncoder.encode("password123"));
            u.setRole(Role.FREELANCER);
            return userRepository.save(u);
        });

        if (projectRepository.count() == 0) {

        // 3. Create Sample Projects
        Project p1 = new Project(null,
                "Next.js E-Commerce Storefront with Razorpay & Cart",
                "Looking for a seasoned developer to build a modern responsive marketplace featuring customer accounts, cart management, checkout with Razorpay, and an admin order dashboard.",
                65000.0,
                "2026-11-15",
                ProjectStatus.OPEN,
                client1,
                "Web Development",
                "Next.js, TypeScript, Tailwind CSS, PostgreSQL"
        );
        projectRepository.save(p1);

        Project p2 = new Project(null,
                "Enterprise ERP & Inventory Management Portal",
                "We need a robust web portal for warehouse stock tracking, supplier purchase orders, and PDF invoice generation with role-based access control.",
                85000.0,
                "2026-11-01",
                ProjectStatus.OPEN,
                client1,
                "Full-Stack Systems",
                "Java, Spring Boot, MySQL, React"
        );
        projectRepository.save(p2);

        Project p3 = new Project(null,
                "Mobile Healthcare & Doctor Appointment App",
                "Design and develop a cross-platform mobile application for booking doctor visits, encrypted medical record storage, and live consultations via WebRTC.",
                120000.0,
                "2026-12-01",
                ProjectStatus.IN_PROGRESS,
                client2,
                "Mobile App Development",
                "React Native, WebRTC, Node.js, PostgreSQL"
        );
        projectRepository.save(p3);

        Project p4 = new Project(null,
                "High-Converting B2B SaaS Landing Page & Brand Kit",
                "Need an aesthetic, clean landing page with micro-interactions, responsive design, and Figma design system components for our B2B SaaS startup.",
                35000.0,
                "2026-10-30",
                ProjectStatus.OPEN,
                client2,
                "UI/UX Design & Branding",
                "Figma, Tailwind CSS, Next.js"
        );
        projectRepository.save(p4);

        // 4. Create Sample Proposals
        Proposal prop1 = new Proposal(null, p1, free1,
                "Hi Priya, I have built 4 production e-commerce platforms using Next.js and payment gateways. I can complete the storefront and backend integrations with clean tests within 14 days.",
                60000.0, 14, ProposalStatus.PENDING);
        proposalRepository.save(prop1);

        Proposal prop2 = new Proposal(null, p1, free2,
                "Hello, I specialize in full-stack TypeScript architectures with Tailwind and Next.js. I will deliver responsive design, optimized caching, and automated payments.",
                62500.0, 12, ProposalStatus.PENDING);
        proposalRepository.save(prop2);

        Proposal prop3 = new Proposal(null, p2, free3,
                "Experienced in enterprise ERP and relational database architectures. I can set up your Spring Boot microservices and intuitive React dashboard effortlessly.",
                80000.0, 20, ProposalStatus.PENDING);
        proposalRepository.save(prop3);

        Proposal prop4 = new Proposal(null, p3, free1,
                "I have developed multiple telemedicine and WebRTC video call apps in React Native. Ready to hit the ground running on schedule.",
                120000.0, 21, ProposalStatus.ACCEPTED);
        proposalRepository.save(prop4);

        // 5. Create Contract for p3
        Contract c1 = new Contract(null, p3, client2, free1, 120000.0,
                "2026-10-01", "2026-10-22", ContractStatus.ACTIVE);
        contractRepository.save(c1);

        // 6. Create Initial Payment
        Payment pay1 = new Payment(null, c1, 40000.0, 4000.0, 36000.0,
                PaymentStatus.SUCCESS, PaymentMethod.CARD, "TXN_INIT_MILESTONE_1");
        paymentRepository.save(pay1);

        // 7. Seed Initial Notifications
        Notification n1 = new Notification(null, client1, NotificationType.IN_APP,
                "New Proposal Received",
                "Aarav Patel submitted a proposal for \"Next.js E-Commerce Storefront with Razorpay & Cart\".",
                false);
        notificationRepository.save(n1);

        Notification n2 = new Notification(null, free1, NotificationType.IN_APP,
                "Contract Active",
                "You were hired by Rahul Verma for \"Mobile Healthcare & Doctor Appointment App\"!",
                true);
        notificationRepository.save(n2);
        }
    }
}
